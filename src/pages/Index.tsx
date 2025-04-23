
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeCTA } from "@/components/home/HomeCTA";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomeHero isAuthenticated={!!isAuthenticated} userName={user?.name} />
      {!isAuthenticated && (
        <>
          <HomeHowItWorks />
          <HomeFeatures />
          <HomeTestimonials />
          <HomeCTA />
        </>
      )}
      <HomeFooter />
    </div>
  );
}
