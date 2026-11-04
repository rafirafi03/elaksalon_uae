import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import Features from "@/components/Features";
import ServiceCategories from "@/components/ServiceCategories";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Products from "@/components/Products";
import Specialists from "@/components/Specialists";
import About from "@/components/About";
import ProductFeature from "@/components/ProductFeature";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <Header />
      <Hero />
      <Features />
      <Offers />
      <Packages />
      <ServiceCategories />
      <Services />
      <Products />
      <Specialists />
      <About />
      <ProductFeature />
      <WhyChooseUs />
      <Reviews />
      <Footer />
    </PageShell>
  );
}
