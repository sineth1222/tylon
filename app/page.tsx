import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { getUser } from "@/lib/actions/auth";
import { getFeaturedProducts } from "@/lib/actions/products";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStory from "@/components/home/BrandStory";
import ShippingBanner from "@/components/home/ShippingBanner";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import AnimationGenderSection from "@/components/home/AnimationGenderSection";
import ColorStoriesSection from "@/components/home/ColorStoriesSection";
import SpeechesSection from "@/components/home/SpeechesSection";
import { getSpeeches } from "@/lib/actions/speeches";

export default async function HomePage() {
  const [user, featuredProducts, speeches] = await Promise.all([
    getUser().catch(() => null),
    getFeaturedProducts(),
    getSpeeches(undefined),
  ]);

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      {/*<MarqueeBanner />*/}
      <main className="pt-0">
        <HeroSection />
        <AnimationGenderSection />
        <ColorStoriesSection />
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-tylon-card mx-6 border border-tylon-border" />
          }
        >
          <FeaturedProducts products={featuredProducts} />
        </Suspense>
        <BrandStory />
        {/*<SpeechesSection speeches={speeches} userEmail={user?.email ?? null} />*/}
        <ShippingBanner />
      </main>
      <Footer />
    </>
  );
}
