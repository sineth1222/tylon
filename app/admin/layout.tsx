import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import AdminSidebar from './AdminSidebar'

export const metadata = { title: 'Admin — ZORA' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) redirect('/admin/login')
  if (user.role !== 'admin') redirect('/admin/login')

  return (
    <div className="min-h-screen bg-cream-200 flex">
      <AdminSidebar user={user} />
      {/* Main content — offset for fixed sidebar */}
      <main className="flex-1 min-h-screen ml-0 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
