'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWishlist(userId: string) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })

  if (error) return { error: error.message }
  revalidatePath('/wishlist')
  return { success: true }
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) return { error: error.message }
  revalidatePath('/wishlist')
  return { success: true }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  return !!data
}
