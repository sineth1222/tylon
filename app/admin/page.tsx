import { getDashboardStats } from '@/lib/actions/orders'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import { ShoppingBag, DollarSign, Package, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AdminRevenueChart from './AdminRevenueChart'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const STAT_CARDS = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-stone-800">Dashboard</h1>
        <p className="text-stone-400 text-sm mt-1">Welcome back. Here's what's happening with ZORA.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map(card => (
          <div key={card.title} className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
              <TrendingUp size={14} className="text-sage-400" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{card.value}</p>
            <p className="text-xs text-stone-400 mt-1 tracking-wide">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-cream-50 border border-cream-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-stone-800">Revenue — Last 7 Days</h2>
          </div>
          <AdminRevenueChart data={stats.revenueByDay} />
        </div>

        {/* Orders by Status */}
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Orders by Status</h2>
          <div className="space-y-3">
            {statusOrder.map(status => {
              const count = stats.ordersByStatus[status] || 0
              const total = stats.totalOrders || 1
              const pct = Math.round((count / total) * 100)

              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(status)}`}>
                      {getOrderStatusLabel(status)}
                    </span>
                    <span className="font-semibold text-stone-700">{count}</span>
                  </div>
                  <div className="h-1.5 bg-cream-200 rounded-full">
                    <div
                      className="h-full bg-stone-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-stone-800">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-center text-stone-400 py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-200">
                  {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-stone-400 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-100 transition-colors">
                    <td className="py-3 px-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono-zora text-xs font-medium text-stone-700 hover:text-charcoal-900">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-sm font-medium text-stone-700">{order.customer_name}</p>
                        <p className="text-xs text-stone-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-sm">{formatPrice(order.total)}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs text-stone-500 capitalize">{order.payment_method}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getOrderStatusColor(order.order_status)}`}>
                        {getOrderStatusLabel(order.order_status)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-stone-400">
                      {new Date(order.created_at).toLocaleDateString('en-LK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
