import { getSpeechById } from "@/lib/actions/speeches";
import { getUser } from "@/lib/actions/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import SpeechDetailClient from "./SpeechDetailClient";
import { notFound } from "next/navigation";

export default async function SpeechDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, speech] = await Promise.all([
    getUser().catch(() => null),
    getSpeechById(id, undefined),
  ]);

  if (!speech) notFound();

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-0 md:pt-10 min-h-screen pb-24">
        <SpeechDetailClient speech={speech} userEmail={user?.email ?? null} />
      </main>
      <Footer />
    </>
  );
}
