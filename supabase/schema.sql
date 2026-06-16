-- ============================================
-- LOOM CLOTHING - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN ('outerwear', 'dresses', 'tailoring', 'basics', 'bottoms', 'accessories')),
  gender TEXT NOT NULL DEFAULT 'unisex' CHECK (gender IN ('mens', 'womens', 'kids', 'unisex')),
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stock_count INTEGER DEFAULT 0,
  material TEXT,
  care_instructions TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADDRESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies (public read)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Wishlist policies
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (user_id = auth.uid());

-- Addresses policies
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'LOOM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 6));
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- SAMPLE DATA - PRODUCTS
-- ============================================
INSERT INTO public.products (name, slug, description, price, original_price, category, gender, sizes, colors, images, is_new, is_featured, stock_count, material) VALUES
('Essential Cotton Tee', 'essential-cotton-tee', 'Our signature cotton tee crafted from 100% premium Pima cotton. The perfect foundation for any wardrobe. Relaxed fit with subtle dropped shoulders for a modern silhouette.', 4500, NULL, 'basics', 'unisex', ARRAY['XS','S','M','L','XL','XXL'], '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#1A1A1A"},{"name":"Sage","hex":"#9BB394"}]', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'], FALSE, TRUE, 120, '100% Pima Cotton'),

('Tailored Wool Trousers', 'tailored-wool-trousers', 'Meticulously crafted wide-leg trousers in a soft wool-blend fabric. Features a high waist, clean front pleats, and a fluid drape that moves beautifully.', 18000, 22000, 'tailoring', 'womens', ARRAY['XS','S','M','L','XL'], '[{"name":"Beige","hex":"#D4B896"},{"name":"Navy","hex":"#1B2A4A"},{"name":"Black","hex":"#1A1A1A"}]', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4e4f?w=800','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800'], FALSE, TRUE, 45, 'Wool Blend'),

('Leather Crossbody', 'leather-crossbody', 'Minimal structured crossbody in full-grain Italian leather. Adjustable strap, interior zip pocket, and antique brass hardware. A piece that only gets better with time.', 21500, NULL, 'accessories', 'womens', ARRAY['One Size'], '[{"name":"Black","hex":"#1A1A1A"},{"name":"Tan","hex":"#C4955A"},{"name":"Cream","hex":"#F5F0E8"}]', ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'], FALSE, TRUE, 30, 'Full-Grain Italian Leather'),

('Cashmere Blend Sweater', 'cashmere-blend-sweater', 'A luxurious cashmere-merino blend in a relaxed fit. Ribbed cuffs and hem, dropped shoulders, and an oversized boxy silhouette. The ultimate in effortless luxury.', 35000, NULL, 'basics', 'unisex', ARRAY['XS','S','M','L','XL'], '[{"name":"Ivory","hex":"#F5F0E0"},{"name":"Camel","hex":"#C4955A"},{"name":"Charcoal","hex":"#4A4A4A"}]', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'], FALSE, TRUE, 60, '70% Cashmere, 30% Merino'),

('Pleated Midi Skirt', 'pleated-midi-skirt', 'A flowing midi skirt with delicate pleating throughout. Made from a lightweight satin-finish fabric that catches the light beautifully. Elasticated waist for comfort.', 15000, NULL, 'bottoms', 'womens', ARRAY['XS','S','M','L','XL'], '[{"name":"Blush","hex":"#E8C4B0"},{"name":"Black","hex":"#1A1A1A"},{"name":"Sage","hex":"#9BB394"}]', ARRAY['https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=800'], FALSE, FALSE, 35, 'Satin Polyester'),

('Linen Button-Down', 'linen-button-down', 'A relaxed linen shirt with a subtle texture and natural wrinkle. Designed for warm days with a breezy fit, mother-of-pearl buttons, and a single chest pocket.', 12000, NULL, 'basics', 'unisex', ARRAY['XS','S','M','L','XL','XXL'], '[{"name":"Natural","hex":"#E8DCC8"},{"name":"White","hex":"#FAFAFA"},{"name":"Blue","hex":"#7BA7BC"}]', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'], TRUE, FALSE, 80, '100% European Linen'),

('Oversized Sunglasses', 'oversized-sunglasses', 'Architectural oversized frames in acetate. UV400 lenses with a slight gradient tint. These are for those who understand that accessories complete a look.', 8500, NULL, 'accessories', 'unisex', ARRAY['One Size'], '[{"name":"Tortoiseshell","hex":"#8B6555"},{"name":"Black","hex":"#1A1A1A"},{"name":"Clear","hex":"#E8E8E8"}]', ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'], FALSE, FALSE, 50, 'Italian Acetate'),

('Chunky Loafers', 'chunky-loafers', 'A platform loafer with chunky sole, crafted in smooth full-grain leather. The thick sole adds height without compromising comfort. The shoe wardrobe essential.', 26000, NULL, 'accessories', 'womens', ARRAY['36','37','38','39','40','41'], '[{"name":"Black","hex":"#1A1A1A"},{"name":"Brown","hex":"#8B6555"}]', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], TRUE, FALSE, 25, 'Full-Grain Leather'),

('Minimalist Overcoat', 'minimalist-overcoat', 'A sleek structured overcoat in a mid-weight wool blend. Clean lines, minimal hardware, and a perfectly tailored fit. The coat that defines a look.', 45000, 55000, 'outerwear', 'unisex', ARRAY['XS','S','M','L','XL'], '[{"name":"Camel","hex":"#C4955A"},{"name":"Black","hex":"#1A1A1A"},{"name":"Grey","hex":"#8A8A8A"}]', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'], TRUE, TRUE, 20, 'Wool Blend'),

('Silk Crepe Dress', 'silk-crepe-dress', 'A bias-cut silk crepe dress with delicate adjustable straps. Falls gracefully to mid-calf with a subtle flare. Minimal and refined for occasions that matter.', 28500, NULL, 'dresses', 'womens', ARRAY['XS','S','M','L'], '[{"name":"Champagne","hex":"#E8D5A3"},{"name":"Black","hex":"#1A1A1A"},{"name":"Dusty Rose","hex":"#D4A0A0"}]', ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'], FALSE, TRUE, 15, '100% Silk Crepe'),

('Structured Blazer', 'structured-blazer', 'A power-shoulder blazer in a refined wool-blend suiting fabric. Single-button closure, welt pockets, and a sculptural silhouette. Wear it over everything.', 32000, NULL, 'tailoring', 'unisex', ARRAY['XS','S','M','L','XL'], '[{"name":"Black","hex":"#1A1A1A"},{"name":"Ivory","hex":"#F5F0E0"},{"name":"Stripe","hex":"#C8C8C8"}]', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4e4f?w=800'], TRUE, TRUE, 30, 'Wool Blend Suiting'),

('Cargo Wide-Leg Pants', 'cargo-wide-leg-pants', 'Relaxed wide-leg pants with utilitarian cargo pockets in a durable cotton canvas. A modern take on the classic cargo silhouette — functional and fashion-forward.', 16500, NULL, 'bottoms', 'unisex', ARRAY['XS','S','M','L','XL','XXL'], '[{"name":"Olive","hex":"#6B7A5A"},{"name":"Beige","hex":"#D4C8A8"},{"name":"Black","hex":"#1A1A1A"}]', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4e4f?w=800'], TRUE, FALSE, 45, '100% Cotton Canvas'),

('Kids Linen Set', 'kids-linen-set', 'A breathable linen co-ord set for little ones. Loose shirt and drawstring shorts in matching natural linen. Easy to wear, easy to wash, endlessly charming.', 7500, NULL, 'basics', 'kids', ARRAY['2Y','4Y','6Y','8Y','10Y'], '[{"name":"Natural","hex":"#E8DCC8"},{"name":"Sage","hex":"#9BB394"}]', ARRAY['https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800'], TRUE, FALSE, 40, '100% Linen'),

('Boys Chino Shorts', 'boys-chino-shorts', 'Classic chino shorts in a stretch cotton blend. Adjustable waistband, front and back pockets. The everyday essential for active boys.', 5500, NULL, 'bottoms', 'kids', ARRAY['2Y','4Y','6Y','8Y','10Y','12Y'], '[{"name":"Navy","hex":"#1B2A4A"},{"name":"Khaki","hex":"#C8B87A"},{"name":"Grey","hex":"#8A8A8A"}]', ARRAY['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'], FALSE, FALSE, 60, 'Stretch Cotton'),

('Girls Smock Dress', 'girls-smock-dress', 'A sweet smocked bodice dress in a lightweight cotton voile. Puff sleeves, adjustable back ties. Effortlessly pretty for all occasions.', 6500, NULL, 'dresses', 'kids', ARRAY['2Y','4Y','6Y','8Y'], '[{"name":"Floral White","hex":"#F5F0E8"},{"name":"Sky Blue","hex":"#A8C4D8"}]', ARRAY['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'], TRUE, FALSE, 25, 'Cotton Voile');

-- ============================================
-- CREATE ADMIN USER FUNCTION
-- (Run after setting up auth)
-- ============================================
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@loomclothing.lk';
