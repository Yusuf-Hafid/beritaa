import YahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

/**
 * GET /api/stocks?market=nasional|internasional
 *
 * Sumber data: Yahoo Finance lewat `yahoo-finance2` (`quote` untuk harga harian,
 * `chart` untuk riwayat 30 hari). Tidak ada angka sintetis: bila satu ticker
 * gagal, ticker itu dilewati dan sisanya tetap dikirim.
 *
 * - nasional      → emiten bank IDX berakhiran `.JK`, mata uang IDR
 * - internasional → bank global USD, mata uang USD
 */

export const revalidate = 300;

const STOCK_REVALIDATE = 300;
const HISTORY_DAYS = 30;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

type MarketSlug = 'nasional' | 'internasional';
type MarketCurrency = 'IDR' | 'USD';

interface HistoryPoint {
  time: string;
  value: number;
}

interface MarketStock {
  symbol: string;
  displaySymbol: string;
  name: string;
  currency: MarketCurrency;
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  history: HistoryPoint[];
}

const MARKETS: Record<
  MarketSlug,
  { currency: MarketCurrency; tickers: string[] }
> = {
  nasional: {
    currency: 'IDR',
    tickers: ['BBCA.JK', 'BBRI.JK', 'BMRI.JK', 'BBNI.JK', 'BRIS.JK'],
  },
  internasional: {
    currency: 'USD',
    tickers: ['JPM', 'BAC', 'WFC', 'C', 'GS'],
  },
};

function isMarketSlug(value: string): value is MarketSlug {
  return value === 'nasional' || value === 'internasional';
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function displaySymbolFor(symbol: string): string {
  return symbol.replace(/\.JK$/i, '');
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function fetchStock(
  symbol: string,
  currency: MarketCurrency,
): Promise<MarketStock | null> {
  try {
    const period1 = new Date();
    period1.setDate(period1.getDate() - HISTORY_DAYS);

    const [quote, chart] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.chart(symbol, { period1, interval: '1d' }),
    ]);

    const price = toNumber(quote.regularMarketPrice);
    if (price === null || price <= 0) return null;

    const previousClose = toNumber(quote.regularMarketPreviousClose);
    const change =
      toNumber(quote.regularMarketChange) ??
      (previousClose !== null ? price - previousClose : 0);
    const percentChange =
      toNumber(quote.regularMarketChangePercent) ??
      (previousClose ? (change / previousClose) * 100 : 0);

    const history: HistoryPoint[] = [];
    const seenDates = new Set<string>();

    for (const candle of chart.quotes) {
      const close = toNumber(candle.close);
      if (close === null) continue;

      const time = formatDate(new Date(candle.date));
      if (seenDates.has(time)) continue;

      seenDates.add(time);
      history.push({ time, value: close });
    }

    return {
      symbol,
      displaySymbol: displaySymbolFor(symbol),
      name: quote.longName ?? quote.shortName ?? displaySymbolFor(symbol),
      currency,
      price,
      change,
      percentChange,
      high: toNumber(quote.regularMarketDayHigh) ?? price,
      low: toNumber(quote.regularMarketDayLow) ?? price,
      volume: toNumber(quote.regularMarketVolume) ?? 0,
      isUp: change >= 0,
      history,
    };
  } catch (error) {
    console.warn(
      `[stocks] ${symbol} gagal:`,
      error instanceof Error ? error.message : 'unknown error',
    );
    return null;
  }
}

const marketCache = new Map<
  MarketSlug,
  { expiresAt: number; stocks: MarketStock[] }
>();

async function loadMarket(market: MarketSlug): Promise<MarketStock[]> {
  const cached = marketCache.get(market);
  if (cached && cached.expiresAt > Date.now()) return cached.stocks;

  const { currency, tickers } = MARKETS[market];
  const results = await Promise.all(
    tickers.map((ticker) => fetchStock(ticker, currency)),
  );
  const stocks = results.filter((stock): stock is MarketStock => stock !== null);

  if (stocks.length > 0) {
    marketCache.set(market, {
      expiresAt: Date.now() + STOCK_REVALIDATE * 1000,
      stocks,
    });
  }

  return stocks;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = (searchParams.get('market') ?? 'nasional').toLowerCase();

  if (!isMarketSlug(requested)) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Parameter `market` harus `nasional` atau `internasional`.',
      },
      { status: 400 },
    );
  }

  try {
    const stocks = await loadMarket(requested);

    if (stocks.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          market: requested,
          message: 'Data saham sedang tidak tersedia dari Yahoo Finance.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        market: requested,
        currency: MARKETS[requested].currency,
        total: stocks.length,
        updatedAt: new Date().toISOString(),
        stocks,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${STOCK_REVALIDATE}, stale-while-revalidate=60`,
        },
      },
    );
  } catch (error) {
    console.warn(
      '[stocks] gagal memuat pasar:',
      error instanceof Error ? error.message : 'unknown error',
    );

    return NextResponse.json(
      {
        status: 'error',
        market: requested,
        message: 'Gagal mengambil data saham.',
      },
      { status: 502 },
    );
  }
}
