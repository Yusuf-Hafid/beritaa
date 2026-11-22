import { NextResponse } from 'next/server';

/**
 * GET /api/rates
 *
 * Kurs 1 USD ke seluruh mata uang yang dikembalikan ExchangeRate API.
 * `EXCHANGERATE_API_KEY` hanya dibaca di server; respons di-cache 30 menit
 * agar kuota API tetap aman.
 */

export const revalidate = 1800;

const EXCHANGE_API = 'https://v6.exchangerate-api.com/v6';
const RATES_REVALIDATE = 1800;

const currencyNames = new Intl.DisplayNames(['id'], { type: 'currency' });

interface LatestResponse {
  result?: string;
  base_code?: string;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
  conversion_rates?: Record<string, number>;
  'error-type'?: string;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

function currencyName(code: string): string {
  try {
    return currencyNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export async function GET() {
  const key = process.env.EXCHANGERATE_API_KEY?.trim();

  if (!key) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'EXCHANGERATE_API_KEY tidak tersedia di environment.',
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${EXCHANGE_API}/${key}/latest/USD`, {
      next: { revalidate: RATES_REVALIDATE },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      console.warn(`[rates] ExchangeRate HTTP ${response.status}`);

      return NextResponse.json(
        {
          status: 'error',
          message: 'Gagal mengambil kurs dari ExchangeRate API.',
        },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as LatestResponse;

    if (
      payload.result !== 'success' ||
      !payload.conversion_rates ||
      Object.keys(payload.conversion_rates).length === 0
    ) {
      console.warn(`[rates] respons tidak valid: ${payload['error-type'] ?? '-'}`);

      return NextResponse.json(
        {
          status: 'error',
          message: 'ExchangeRate API mengembalikan respons tanpa kurs.',
        },
        { status: 502 },
      );
    }

    const rates: CurrencyRate[] = Object.entries(payload.conversion_rates)
      .filter(([, rate]) => Number.isFinite(rate) && rate > 0)
      .map(([code, rate]) => ({ code, name: currencyName(code), rate }))
      .sort((a, b) => a.code.localeCompare(b.code));

    const updatedAt = payload.time_last_update_unix
      ? new Date(payload.time_last_update_unix * 1000).toISOString()
      : null;

    return NextResponse.json(
      {
        status: 'success',
        base: payload.base_code ?? 'USD',
        total: rates.length,
        updatedAt,
        updatedAtUtc: payload.time_last_update_utc ?? null,
        rates,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${RATES_REVALIDATE}, stale-while-revalidate=300`,
        },
      },
    );
  } catch (error) {
    console.warn(
      '[rates] gagal menghubungi ExchangeRate API:',
      error instanceof Error ? error.message : 'unknown error',
    );

    return NextResponse.json(
      {
        status: 'error',
        message: 'Gagal menghubungi ExchangeRate API.',
      },
      { status: 502 },
    );
  }
}
