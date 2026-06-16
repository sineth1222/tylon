import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistClient from "./WishlistClient";
import { getUser } from "@/lib/actions/auth";
import { getWishlist } from "@/lib/actions/wishlist";

export const metadata = { title: "Wishlist — TYLON" };

export default async function WishlistPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const wishlistItems = await getWishlist(user.id);

  return (
    <>
      <Navbar user={user} />
      <main className="pt-10 min-h-screen pb-16 px-6">
        <WishlistClient items={wishlistItems} userId={user.id} />
      </main>
      <Footer />
    </>
  );
}
