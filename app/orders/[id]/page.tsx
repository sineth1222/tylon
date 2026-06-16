import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderTrackingClient from "./OrderTrackingClient";
import { getUser } from "@/lib/actions/auth";
import { getOrderById } from "@/lib/actions/orders";

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderPage({
  params,
  searchParams,
}: OrderPageProps) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [user, order] = await Promise.all([getUser(), getOrderById(id)]);
  if (!order) notFound();

  return (
    <>
      <Navbar user={user} />
      <main className="pt-10 md:pt-32 min-h-screen pb-16 px-6">
        <OrderTrackingClient order={order} isSuccess={sp.success === "true"} />
      </main>
      <Footer />
    </>
  );
}
