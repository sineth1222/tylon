'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AdminRevenueChartProps {
  data: { date: string; revenue: number }[]
}

export default function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  const formatted = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DE" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#707070' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#707070' }} axisLine={false} tickLine={false}
          tickFormatter={v => `Rs.${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, 'Revenue']}
          contentStyle={{ borderRadius: '12px', border: '1px solid #EDE8DE', fontSize: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#1A1A1A"
          strokeWidth={2}
          fill="url(#revenueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
