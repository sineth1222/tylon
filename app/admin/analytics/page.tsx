import { getDashboardStats } from '@/lib/actions/orders'
import { formatPrice } from '@/lib/utils'
import AdminRevenueChart from '../AdminRevenueChart'

export const metadata = { title: 'Analytics — LOOM Admin' }

export default async function AdminAnalyticsPage() {
  const stats = await getDashboardStats()

  const statusData = Object.entries(stats.ordersByStatus).map(([status, count]) => ({
    status,
    count,
    pct: Math.round((count / (stats.totalOrders || 1)) * 100),
  }))

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-stone-800">Analytics</h1>
        <p className="text-stone-400 text-sm mt-1">Overview of store performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), sub: 'All time' },
          { label: 'Total Orders', value: stats.totalOrders, sub: 'All time' },
          { label: 'Avg. Order Value', value: formatPrice(stats.totalOrders ? stats.totalRevenue / stats.totalOrders : 0), sub: 'Per order' },
          { label: 'Total Customers', value: stats.totalCustomers, sub: 'Registered' },
        ].map(k => (
          <div key={k.label} className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
            <p className="text-2xl font-bold text-stone-800">{k.value}</p>
            <p className="text-xs font-medium text-stone-600 mt-1">{k.label}</p>
            <p className="text-[10px] text-stone-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-6">Revenue — Last 7 Days</h2>
        <AdminRevenueChart data={stats.revenueByDay} />
      </div>

      {/* Order breakdown */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
        <h2 className="font-semibold text-stone-800 mb-5">Order Status Breakdown</h2>
        <div className="space-y-4">
          {statusData.map(({ status, count, pct }) => (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="capitalize font-medium text-stone-700">{status}</span>
                <span className="text-stone-400">{count} orders ({pct}%)</span>
              </div>
              <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-600 rounded-full"
                  style={{ width: `${pct}%`, transition: 'width 0.5s ease' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
