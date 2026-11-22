'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  AreaSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type Time,
} from 'lightweight-charts';

export interface HistoryPoint {
  time: string;
  value: number;
}

const UP_COLOR = '#16a34a';
const DOWN_COLOR = '#dc2626';

/** Baca token warna Tailwind (triplet HSL) dari :root. */
function cssColor(variable: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  if (!value) return fallback;

  return value.startsWith('#') ||
    value.startsWith('hsl') ||
    value.startsWith('rgb')
    ? value
    : `hsl(${value})`;
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function MarketChart({
  points,
  height = 260,
  positive = true,
}: {
  points: HistoryPoint[];
  height?: number;
  positive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const textColor = cssColor('--muted-foreground', '#94a3b8');
    const borderColor = cssColor('--border', 'rgba(148, 163, 184, 0.3)');

    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor,
        fontFamily: 'inherit',
      },
      grid: {
        vertLines: { color: borderColor },
        horzLines: { color: borderColor },
      },
      rightPriceScale: { borderColor },
      timeScale: { borderColor, timeVisible: false },
      localization: { locale: 'id-ID' },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        chart.applyOptions({ width: Math.floor(width) });
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      seriesRef.current = null;
      chartRef.current = null;
      chart.remove();
    };
  }, [height, resolvedTheme]);

  useEffect(() => {
    const series = seriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart) return;

    const color = positive ? UP_COLOR : DOWN_COLOR;

    series.applyOptions({
      lineColor: color,
      topColor: withAlpha(color, 0.28),
      bottomColor: withAlpha(color, 0),
    });

    series.setData(
      points.map<LineData<Time>>((point) => ({
        time: point.time as Time,
        value: point.value,
      })),
    );

    chart.timeScale().fitContent();
  }, [points, positive]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Grafik pergerakan harga saham 30 hari terakhir"
    />
  );
}
