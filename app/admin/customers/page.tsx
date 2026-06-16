import { createAdminClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Customers — LOOM Admin' }

export default async function AdminCustomersPage() {
  const supabase = await createAdminClient()
  const { data: customers } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-stone-800">Customers</h1>
        <p className="text-stone-400 text-sm mt-1">{customers?.length || 0} registered customers</p>
      </div>

      <div className="bg-cream-50 border border-cream-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-cream-200">
            <tr>
              {['Customer', 'Verified', 'Joined', 'Phone'].map(h => (
                <th key={h} className="text-left py-4 px-4 text-[10px] font-semibold tracking-[0.15em] text-stone-400 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!customers?.length ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-stone-400">No customers yet.</td>
              </tr>
            ) : customers.map(c => (
              <tr key={c.id} className="border-b border-cream-100 hover:bg-cream-100 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
                      <span className="text-cream-100 text-sm font-bold">
                        {c.full_name?.[0]?.toUpperCase() || c.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-stone-800">{c.full_name || '—'}</p>
                      <p className="text-xs text-stone-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.is_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-stone-500">{formatDate(c.created_at)}</td>
                <td className="py-3 px-4 text-sm text-stone-500">{c.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
