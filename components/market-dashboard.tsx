'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronsUpDown,
  LineChart as LineChartIcon,
  TrendingUp,
} from 'lucide-react';
import { MarketChart, type HistoryPoint } from '@/components/market-chart';
import { formatWaktuRelatif } from '@/lib/format';
import { cn } from '@/lib/utils';

type Market = 'nasional' | 'internasional';

interface MarketStock {
  symbol: string;
  displaySymbol: string;
  name: string;
  currency: 'IDR' | 'USD';
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  history: HistoryPoint[];
}

interface StocksPayload {
  status: string;
  currency?: 'IDR' | 'USD';
  total?: number;
  updatedAt?: string;
  stocks?: MarketStock[];
  message?: string;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

interface RatesPayload {
  status: string;
  base?: string;
  total?: number;
  updatedAt?: string | null;
  rates?: CurrencyRate[];
  message?: string;
}

interface MarketState {
  stocks: MarketStock[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const MARKETS: { id: Market; label: string; currency: 'IDR' | 'USD' }[] = [
  { id: 'nasional', label: 'Saham Nasional', currency: 'IDR' },
  { id: 'internasional', label: 'Saham Internasional', currency: 'USD' },
];

const QUICK_CURRENCIES = ['IDR', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR', 'SAR', 'CNY'];

const initialState: MarketState = {
  stocks: [],
  loading: false,
  loaded: false,
  error: null,
};

function formatStockPrice(value: number, currency: 'IDR' | 'USD'): string {
  if (!Number.isFinite(value)) return '—';

  if (currency === 'IDR') {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
  }

  return `$${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function formatCurrencyAmount(value: number, code: string): string {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 4,
    }).format(value);
  } catch {
    return `${value.toFixed(4)} ${code}`;
  }
}

function formatVolume(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
}

export function MarketDashboard() {
  const [market, setMarket] = useState<Market>('nasional');
  const [markets, setMarkets] = useState<Record<Market, MarketState>>({
    nasional: initialState,
    internasional: initialState,
  });
  const [picked, setPicked] = useState<Record<Market, string | null>>({
    nasional: null,
    internasional: null,
  });

  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  const [amount, setAmount] = useState('1');
  const [targetCode, setTargetCode] = useState('IDR');
  const [currencyQuery, setCurrencyQuery] = useState('');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyBoxRef = useRef<HTMLDivElement | null>(null);

  const loadMarket = useCallback(async (next: Market) => {
    setMarkets((prev) => ({
      ...prev,
      [next]: { ...prev[next], loading: true, error: null },
    }));

    try {
      const response = await fetch(`/api/stocks?market=${next}`);
      const payload = (await response.json()) as StocksPayload;

      if (!response.ok || payload.status !== 'success' || !payload.stocks) {
        throw new Error(payload.message ?? 'Data saham tidak tersedia.');
      }

      setMarkets((prev) => ({
        ...prev,
        [next]: {
          stocks: payload.stocks ?? [],
          loading: false,
          loaded: true,
          error: null,
        },
      }));
    } catch (error) {
      setMarkets((prev) => ({
        ...prev,
        [next]: {
          stocks: [],
          loading: false,
          loaded: true,
          error:
            error instanceof Error
              ? error.message
              : 'Tidak bisa menghubungi server.',
        },
      }));
    }
  }, []);

  useEffect(() => {
    const state = markets[market];
    if (!state.loaded && !state.loading) void loadMarket(market);
  }, [market, markets, loadMarket]);

  useEffect(() => {
    let active = true;

    const loadRates = async () => {
      try {
        const response = await fetch('/api/rates');
        const payload = (await response.json()) as RatesPayload;

        if (!response.ok || payload.status !== 'success' || !payload.rates) {
          throw new Error(payload.message ?? 'Kurs tidak tersedia.');
        }

        if (!active) return;

        setRates(payload.rates);
        setRatesUpdatedAt(payload.updatedAt ?? null);
      } catch (error) {
        if (!active) return;
        setRatesError(
          error instanceof Error ? error.message : 'Gagal memuat kurs.',
        );
      } finally {
        if (active) setRatesLoading(false);
      }
    };

    void loadRates();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!currencyOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!currencyBoxRef.current?.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCurrencyOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currencyOpen]);

  const current = markets[market];
  const activeStock =
    current.stocks.find((stock) => stock.symbol === picked[market]) ??
    current.stocks[0] ??
    null;

  const filteredCurrencies = useMemo(() => {
    const term = currencyQuery.trim().toLowerCase();
    if (!term) return rates;

    return rates.filter(
      (currency) =>
        currency.code.toLowerCase().includes(term) ||
        currency.name.toLowerCase().includes(term),
    );
  }, [currencyQuery, rates]);

  const targetCurrency = rates.find((currency) => currency.code === targetCode);
  const amountValue = Number.parseFloat(amount.replace(',', '.'));
  const converted =
    targetCurrency && Number.isFinite(amountValue)
      ? amountValue * targetCurrency.rate
      : null;

  const selectCurrency = (code: string) => {
    setTargetCode(code);
    setCurrencyQuery('');
    setCurrencyOpen(false);
  };

  return (
    <section
      aria-labelledby="market-dashboard-title"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10"
            aria-hidden
          >
            <TrendingUp className="h-4 w-4 text-brand" />
          </span>
          <div>
            <p className="eyebrow text-brand">Pasar Finansial</p>
            <h2
              id="market-dashboard-title"
              className="mt-0.5 font-serif text-h2 font-black tracking-tight text-foreground"
            >
              Saham &amp; Kurs
            </h2>
          </div>
        </div>
        <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
          Yahoo Finance · ExchangeRate API
        </p>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12">
        {/* ── Saham ── */}
        <div className="space-y-4 lg:col-span-7">
          <div
            role="tablist"
            aria-label="Pilih pasar saham"
            className="flex gap-1 rounded-full border border-border bg-muted/40 p-1"
          >
            {MARKETS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={market === item.id}
                onClick={() => setMarket(item.id)}
                className={cn(
                  'flex-1 rounded-full px-3 py-1.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] transition-colors',
                  market === item.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {current.error && (
            <p
              aria-live="polite"
              className="rounded-xl border border-dashed border-breaking/40 bg-breaking/5 px-4 py-3 text-sm font-medium text-foreground"
            >
              {current.error}
            </p>
          )}

          {current.loading && current.stocks.length === 0 && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[3.25rem] animate-pulse rounded-xl border border-border bg-muted/40"
                />
              ))}
            </div>
          )}

          {current.stocks.length > 0 && (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
              {current.stocks.map((stock) => {
                const isActive = activeStock?.symbol === stock.symbol;

                return (
                  <li key={stock.symbol}>
                    <button
                      type="button"
                      onClick={() =>
                        setPicked((prev) => ({
                          ...prev,
                          [market]: stock.symbol,
                        }))
                      }
                      aria-pressed={isActive}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors',
                        isActive ? 'bg-brand/5' : 'hover:bg-muted/50',
                      )}
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-foreground">
                            {stock.displaySymbol}
                          </span>
                          {isActive && (
                            <Check
                              className="h-3 w-3 text-brand"
                              aria-hidden
                            />
                          )}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {stock.name}
                        </span>
                      </span>
                      <span className="flex flex-shrink-0 flex-col items-end">
                        <span className="text-sm font-extrabold tabular-nums text-foreground">
                          {formatStockPrice(stock.price, stock.currency)}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5 text-xs font-bold tabular-nums',
                            stock.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                          )}
                        >
                          {stock.isUp ? (
                            <ArrowUpRight className="h-3 w-3" aria-hidden />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" aria-hidden />
                          )}
                          {stock.percentChange >= 0 ? '+' : ''}
                          {stock.percentChange.toFixed(2)}%
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {activeStock && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="eyebrow text-muted-foreground">
                    {activeStock.displaySymbol} · {activeStock.name}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-black tracking-tight text-foreground">
                    {formatStockPrice(activeStock.price, activeStock.currency)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <span className="font-bold uppercase tracking-[0.1em]">
                      High
                    </span>{' '}
                    <span className="font-extrabold tabular-nums text-foreground">
                      {formatStockPrice(activeStock.high, activeStock.currency)}
                    </span>
                  </span>
                  <span>
                    <span className="font-bold uppercase tracking-[0.1em]">
                      Low
                    </span>{' '}
                    <span className="font-extrabold tabular-nums text-foreground">
                      {formatStockPrice(activeStock.low, activeStock.currency)}
                    </span>
                  </span>
                  <span>
                    <span className="font-bold uppercase tracking-[0.1em]">
                      Vol
                    </span>{' '}
                    <span className="font-extrabold tabular-nums text-foreground">
                      {formatVolume(activeStock.volume)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-2">
                <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-1">
                  <p className="inline-flex items-center gap-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                    <LineChartIcon
                      className="h-3.5 w-3.5 text-brand"
                      aria-hidden
                    />
                    Grafik 30 hari
                  </p>
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    {current.loading ? 'Memuat…' : 'Yahoo Finance'}
                  </p>
                </div>

                {activeStock.history.length > 0 ? (
                  <MarketChart
                    points={activeStock.history}
                    positive={activeStock.isUp}
                  />
                ) : (
                  <div className="flex h-[260px] items-center justify-center px-4 text-center text-sm text-muted-foreground">
                    Grafik belum tersedia.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Konverter mata uang ── */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-brand" aria-hidden />
              <p className="eyebrow text-muted-foreground">
                Konverter Mata Uang
              </p>
            </div>

            <label
              htmlFor="market-amount"
              className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground"
            >
              Nominal (USD)
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                $
              </span>
              <input
                id="market-amount"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2 pl-7 pr-14 text-sm font-bold text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                USD
              </span>
            </div>

            <label
              htmlFor="market-currency-search"
              className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground"
            >
              Mata uang tujuan
            </label>

            <div className="relative mt-1.5" ref={currencyBoxRef}>
              <button
                type="button"
                id="market-currency-search"
                onClick={() => setCurrencyOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={currencyOpen}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-left text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <span className="truncate">
                  {targetCurrency
                    ? `${targetCurrency.code} — ${targetCurrency.name}`
                    : ratesLoading
                      ? 'Memuat mata uang…'
                      : `${targetCode} — ${targetCode}`}
                </span>
                <ChevronsUpDown
                  className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </button>

              {currencyOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-card">
                  <div className="border-b border-border p-2">
                    <input
                      type="search"
                      autoFocus
                      value={currencyQuery}
                      onChange={(event) =>
                        setCurrencyQuery(event.target.value)
                      }
                      placeholder="Cari kode atau nama, contoh: JPY"
                      aria-label="Cari mata uang"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                    />
                  </div>

                  <ul
                    role="listbox"
                    aria-label="Daftar mata uang"
                    className="max-h-60 overflow-y-auto py-1"
                  >
                    {filteredCurrencies.length === 0 && (
                      <li className="px-3 py-2 text-sm text-muted-foreground">
                        {ratesLoading
                          ? 'Memuat mata uang…'
                          : 'Mata uang tidak ditemukan.'}
                      </li>
                    )}

                    {filteredCurrencies.map((currency) => (
                      <li key={currency.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={currency.code === targetCode}
                          onClick={() => selectCurrency(currency.code)}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm transition-colors',
                            currency.code === targetCode
                              ? 'bg-brand/10 font-extrabold text-brand'
                              : 'text-foreground hover:bg-muted/60',
                          )}
                        >
                          <span className="truncate">
                            <span className="font-extrabold">
                              {currency.code}
                            </span>{' '}
                            <span className="text-muted-foreground">
                              {currency.name}
                            </span>
                          </span>
                          <span className="flex-shrink-0 text-xs tabular-nums text-muted-foreground">
                            {currency.rate.toLocaleString('id-ID', {
                              maximumFractionDigits: 4,
                            })}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Hasil konversi
              </p>
              <p className="mt-1 break-words font-serif text-2xl font-black tracking-tight text-foreground">
                {converted !== null && targetCurrency
                  ? formatCurrencyAmount(converted, targetCurrency.code)
                  : '—'}
              </p>
              {targetCurrency && (
                <p className="mt-2 text-xs text-muted-foreground">
                  1 USD ={' '}
                  {formatCurrencyAmount(targetCurrency.rate, targetCurrency.code)}
                </p>
              )}
              {ratesUpdatedAt && (
                <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Kurs diperbarui {formatWaktuRelatif(ratesUpdatedAt)}
                </p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                Mata uang utama
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_CURRENCIES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => selectCurrency(code)}
                    aria-pressed={code === targetCode}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] transition-colors',
                      code === targetCode
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-border text-muted-foreground hover:border-brand hover:text-brand',
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {ratesError && (
              <p
                aria-live="polite"
                className="mt-auto pt-4 text-xs text-muted-foreground"
              >
                {ratesError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
