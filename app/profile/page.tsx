import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileClient from "./ProfileClient";
import { getUser } from "@/lib/actions/auth";
import { getUserOrders } from "@/lib/actions/orders";

export const metadata = { title: "My Account — TYLON" };

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/");

  const orders = await getUserOrders(user.id);

  return (
    <>
      <Navbar user={user} />
      <main className="pt-10 md:pt-32 min-h-screen pb-16 px-6">
        <ProfileClient user={user} orders={orders} />
      </main>
      <Footer />
    </>
  );
}
