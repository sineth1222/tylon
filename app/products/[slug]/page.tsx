import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import ProductDetailClient from "./ProductDetailClient";
import { getUser } from "@/lib/actions/auth";
import { getProductBySlug, getProducts } from "@/lib/actions/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found — TYLON" };
  return {
    title: `${product.name} — TYLON`,
    description:
      product.description || `Shop ${product.name} from TYLON Luxury Clothing`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [user, product, allProducts] = await Promise.all([
    getUser(),
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-10 md:pt-32 min-h-screen">
        <ProductDetailClient
          product={product}
          relatedProducts={related}
          user={user}
        />
      </main>
      <Footer />
    </>
  );
}
