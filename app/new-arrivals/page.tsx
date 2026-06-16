import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import ProductCard from "@/components/products/ProductCard";
import { getUser } from "@/lib/actions/auth";
import { getProducts } from "@/lib/actions/products";

export const metadata = {
  title: "New Drops — TYLON",
  description: "Fresh armor just landed. New TYLON drops.",
};

export default async function NewArrivalsPage() {
  const [user, allProducts] = await Promise.all([getUser(), getProducts()]);
  const newProducts = allProducts.filter((p) => p.is_new);

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-0 md:pt-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="py-12 md:py-16 border-b border-tylon-border mb-10">
            <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-3">
              — FRESH INTEL
            </p>
            <div className="flex items-end justify-between">
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary uppercase">
                NEW DROPS
              </h1>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 bg-army animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-army uppercase">
                  LIVE NOW
                </span>
              </div>
            </div>
            <p className="font-body text-tylon-muted text-sm mt-3 max-w-md">
              Each new piece carries a fresh story. A new declaration. Claim
              yours before it's gone.
            </p>
          </div>

          {newProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-6xl font-bold text-tylon-muted/20 tracking-[0.2em] mb-4">
                INCOMING
              </p>
              <p className="font-mono text-[11px] text-tylon-muted tracking-widest">
                NEW DROPS LOADING — CHECK BACK SOON
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
