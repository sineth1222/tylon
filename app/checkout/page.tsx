import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import AuthModal from '@/components/auth/AuthModal'
import CheckoutClient from './CheckoutClient'
import { getUser } from '@/lib/actions/auth'

export const metadata = { title: 'Checkout — TYLON' }

export default async function CheckoutPage() {
  const user = await getUser()

  // Must be logged in to checkout
  if (!user) {
    return (
      <>
        <Navbar user={null} />
        <AuthModal />
        <CheckoutClient user={null} />
      </>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <CheckoutClient user={user} />
    </>
  )
}
