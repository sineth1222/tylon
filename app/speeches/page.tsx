import { getSpeechById, getSpeeches } from "@/lib/actions/speeches";
import { getUser } from "@/lib/actions/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import SpeechesSection from "@/components/home/SpeechesSection";

export default async function SpeechSectionPage() {
  const [user, speeches] = await Promise.all([
    getUser().catch(() => null),
    getSpeeches(undefined),
  ]);

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-0 md:pt-10 min-h-screen pb-24">
        <SpeechesSection speeches={speeches} userEmail={user?.email ?? null} />
      </main>
      <Footer />
    </>
  );
}
