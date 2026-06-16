# LOOM Clothing — Full-Stack E-Commerce

A premium Sri Lankan clothing e-commerce built with **Next.js 15**, **Supabase**, **Tailwind CSS**, and **Nodemailer**.

---

## 🗂 Project Structure

```
loom-ecommerce/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── not-found.tsx               # 404 page
│   ├── collections/                # All collections + filters
│   ├── new-arrivals/               # New arrivals page
│   ├── products/[slug]/            # Product detail page
│   ├── checkout/                   # Checkout (login required)
│   ├── orders/[id]/                # Order tracking
│   ├── profile/                    # User account
│   ├── wishlist/                   # Saved items
│   ├── about/                      # Brand story
│   └── admin/                      # Admin panel
│       ├── page.tsx                # Dashboard
│       ├── orders/                 # Order management
│       ├── products/               # Product CRUD
│       ├── customers/              # Customer list
│       └── analytics/              # Analytics
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── home/                       # Hero, Featured, etc.
│   ├── products/                   # ProductCard
│   ├── cart/                       # CartSidebar
│   ├── auth/                       # AuthModal
│   └── ui/                         # WhatsApp button
├── lib/
│   ├── supabase/                   # Client & server clients
│   ├── actions/                    # Server actions
│   │   ├── auth.ts                 # Sign up/in/out + verify
│   │   ├── products.ts             # Product CRUD
│   │   ├── orders.ts               # Order management
│   │   └── wishlist.ts             # Wishlist
│   ├── cart-context.tsx            # Cart state (localStorage)
│   ├── email.ts                    # Nodemailer templates
│   └── utils.ts                    # Helpers
├── types/
│   └── index.ts                    # TypeScript types
├── supabase/
│   └── schema.sql                  # Full DB schema + sample data
└── middleware.ts                   # Auth route protection
```

---

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
cd loom-ecommerce
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **Anon Key** and **Service Role Key**
3. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_32_char_secret_here

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=noreply@loomclothing.lk

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=94771234567
```

### 4. Set Up Gmail App Password (for emails)

1. Go to your Google Account → Security → 2-Step Verification (enable it)
2. Go to **App passwords** → Create one for "Mail"
3. Use that 16-character password as `SMTP_PASS`

### 5. Create Admin User

1. Run the app and register with your admin email
2. Verify your email via the code
3. In Supabase SQL Editor, run:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🚀 Deployment

### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard.

### Option B: Digital Ocean App Platform

1. Push to GitHub
2. Go to [DigitalOcean](https://cloud.digitalocean.com) → App Platform → New App
3. Connect GitHub repo
4. Add environment variables
5. Set build command: `npm run build`
6. Set run command: `npm start`

### Option C: Digital Ocean Droplet (VPS)

```bash
# On your droplet (Ubuntu 22.04)
sudo apt update && sudo apt install -y nodejs npm nginx certbot

# Clone & build
git clone your-repo
cd loom-ecommerce
npm install
npm run build

# Install PM2
npm install -g pm2
pm2 start npm --name "loom" -- start
pm2 startup
pm2 save

# Nginx config
sudo nano /etc/nginx/sites-available/loom

# Paste:
server {
    server_name loomclothing.lk www.loomclothing.lk;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/loom /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d loomclothing.lk
```

---

## 🗃 Database Tables

| Table | Description |
|-------|-------------|
| `users` | Customer profiles (extends Supabase auth) |
| `products` | Product catalog with images, sizes, colors |
| `orders` | Orders with status history |
| `wishlist` | User saved products |
| `addresses` | Saved delivery addresses |
| `reviews` | Product reviews |

---

## 🔑 Key Features

### Customer
- ✅ Browse by category: Outerwear, Dresses, Tailoring, Basics, Bottoms, Accessories
- ✅ Filter by gender: Men's, Women's, Kids, Unisex
- ✅ Price range filters
- ✅ Sort by: Newest, Price, Name
- ✅ Product detail: size selector, color picker, quantity
- ✅ Cart (localStorage, persisted)
- ✅ Email verification before account activation
- ✅ Checkout requires login
- ✅ Cash on Delivery OR Online Payment
- ✅ Order confirmation email (Nodemailer)
- ✅ Order tracking with timeline
- ✅ Wishlist
- ✅ WhatsApp floating button

### Admin (`/admin`)
- ✅ Dashboard with live stats
- ✅ Revenue chart (last 7 days)
- ✅ Product CRUD (add, edit, archive)
- ✅ Orders list with search + status filter
- ✅ Order detail with full customer info
- ✅ Update order status → email customer automatically
- ✅ Add tracking number
- ✅ Customer list
- ✅ Analytics breakdown

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#F9F7F3` (cream-100) |
| Primary text | `#1A1A1A` (charcoal-800) |
| Muted text | `#707070` |
| Accent green | `#6E9165` (sage) |
| Accent gold | `#D4A817` |
| Border | `#EDE8DE` (cream-300) |
| Font display | Cormorant Garamond |
| Font body | DM Sans |
| Font mono | Space Mono |

---

## 📧 Email Templates

All emails use inline HTML with LOOM branding:

- **Verification email** — 6-digit code with 15-min expiry
- **Order confirmation** — Full order details, items, address
- **Status update** — Sent when admin changes order status

---

## 🔒 Security

- Supabase RLS (Row Level Security) on all tables
- Admin routes protected via middleware + server-side role check
- Email verification required before account activation
- JWT-based sessions via Supabase Auth
- Server Actions for all mutations (no exposed API endpoints)

---

## 📱 Mobile Responsive

Fully responsive breakpoints:
- Mobile: 1-column grid, collapsible nav
- Tablet: 2-column grid
- Desktop: 4-column grid, sidebar layouts

---

*Built with ❤️ for LOOM Clothing, Colombo, Sri Lanka*
