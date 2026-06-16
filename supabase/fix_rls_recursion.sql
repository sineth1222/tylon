-- ============================================================
-- FIX: Infinite recursion in RLS policies
-- Run this in Supabase SQL Editor to fix the 42P17 error
-- ============================================================

-- Step 1: Drop ALL existing policies on the users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Step 2: Drop broken admin policies on other tables that reference users
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- Step 3: Create a SECURITY DEFINER function that safely checks admin role
-- This avoids the recursive policy lookup
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 4: Re-create users policies using auth.uid() directly (no recursion)
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_admin_select_all"
  ON public.users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "users_admin_update_all"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- Step 5: Re-create product policies
CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (public.is_admin());

-- Step 6: Re-create order policies
CREATE POLICY "orders_admin_all"
  ON public.orders FOR ALL
  USING (public.is_admin());

-- Step 7: Re-create storage policies
CREATE POLICY "storage_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "storage_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND public.is_admin());

-- ============================================================
-- Also fix the handle_new_user trigger to be more robust
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'customer',
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
