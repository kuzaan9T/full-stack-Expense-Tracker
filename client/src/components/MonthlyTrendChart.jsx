import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompactMoney, formatMoney, formatMonth, formatShortMonth } from '@/lib/format';

const SERIES = [
  { key: 'income', label: 'Income', color: 'var(--income)' },
  { key: 'expense', label: 'Expenses', color: 'var(--expense)' },
];

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const net = point.income - point.expense;

  return (
    <div className="min-w-44 rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1.5 font-medium">{formatMonth(point.month)}</p>
      {SERIES.map((series) => (
        <div key={series.key} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2.5 rounded-sm" style={{ background: series.color }} />
            {series.label}
          </span>
          <span className="tabular font-medium">{formatMoney(point[series.key], currency)}</span>
        </div>
      ))}
      <div className="mt-1.5 flex justify-between gap-4 border-t pt-1.5">
        <span className="text-muted-foreground">Net</span>
        <span className="tabular font-medium">{formatMoney(net, currency)}</span>
      </div>
    </div>
  );
}

export function TrendLegend() {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {SERIES.map((series) => (
        <span key={series.key} className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm" style={{ background: series.color }} />
          {series.label}
        </span>
      ))}
    </div>
  );
}

export default function MonthlyTrendChart({ data, currency }) {
  const chartData = data.map((point) => ({ ...point, label: formatShortMonth(point.month) }));

  return (
    <>
      <div className="h-64 w-full lg:h-96" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="28%" margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={6}
            />
            <YAxis
              width={52}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => formatCompactMoney(value, currency)}
            />
            <Tooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
              content={<ChartTooltip currency={currency} />}
            />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                fill={series.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Income and expenses for the last six months</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Income</th>
            <th scope="col">Expenses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{formatMonth(point.month)}</th>
              <td>{formatMoney(point.income, currency)}</td>
              <td>{formatMoney(point.expense, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
