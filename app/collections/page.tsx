import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import CollectionsClient from "./CollectionsClient";
import { getUser } from "@/lib/actions/auth";
import { getProducts } from "@/lib/actions/products";

export const metadata = {
  title: "Collections — TYLON",
  description: "Explore all TYLON collections.",
};

interface Props {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    price?: string;
    sort?: string;
  }>;
}

export default async function CollectionsPage({ searchParams }: Props) {
  const [user, products, sp] = await Promise.all([
    getUser().catch(() => null),
    getProducts(),
    searchParams,
  ]);
  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-0 md:pt-10 min-h-screen">
        <CollectionsClient
          products={products}
          initialCategory={sp.category}
          initialGender={sp.gender}
          //initialSearchParams={sp}
          //user={user}
        />
      </main>
      <Footer />
    </>
  );
}
