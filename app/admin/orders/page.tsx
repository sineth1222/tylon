import { getAllOrders } from '@/lib/actions/orders'
import AdminOrdersClient from './AdminOrdersClient'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const { orders, count } = await getAllOrders({
    status: sp.status as any,
    search: sp.search,
    limit,
    offset,
  })

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-stone-800">Orders</h1>
        <p className="text-stone-400 text-sm mt-1">{count} total orders</p>
      </div>
      <AdminOrdersClient
        orders={orders}
        count={count}
        page={page}
        totalPages={totalPages}
        currentStatus={sp.status}
        currentSearch={sp.search}
      />
    </div>
  )
}
