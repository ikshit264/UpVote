'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<'light' | 'dark', string> }
  );
};

const chartLoading = () => (
  <div className="flex aspect-video items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
    Loading chart...
  </div>
);

const DynamicChartContainer = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartContainer),
  { ssr: false, loading: chartLoading },
);

const DynamicChartTooltip = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartTooltip),
  { ssr: false },
);

const DynamicChartTooltipContent = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartTooltipContent),
  { ssr: false },
);

const DynamicChartLegend = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartLegend),
  { ssr: false },
);

const DynamicChartLegendContent = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartLegendContent),
  { ssr: false },
);

const DynamicChartStyle = dynamic(
  () => import('./chart-impl').then((mod) => mod.ChartStyle),
  { ssr: false },
);

export function ChartContainer(
  props: React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ReactNode;
  },
) {
  return <DynamicChartContainer {...props} />;
}

export function ChartTooltip(
  props: Record<string, unknown> & { children?: React.ReactNode },
) {
  return <DynamicChartTooltip {...props} />;
}

export function ChartTooltipContent(
  props: Record<string, unknown> & { children?: React.ReactNode },
) {
  return <DynamicChartTooltipContent {...props} />;
}

export function ChartLegend(
  props: Record<string, unknown> & { children?: React.ReactNode },
) {
  return <DynamicChartLegend {...props} />;
}

export function ChartLegendContent(
  props: Record<string, unknown> & { children?: React.ReactNode },
) {
  return <DynamicChartLegendContent {...props} />;
}

export function ChartStyle(props: { id: string; config: ChartConfig }) {
  return <DynamicChartStyle {...props} />;
}
