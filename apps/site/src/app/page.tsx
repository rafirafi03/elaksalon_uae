import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Specialists from "@/components/Specialists";
import About from "@/components/About";
import ProductFeature from "@/components/ProductFeature";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <Header />
      <Hero />
      <Features />
      <Services />
      <Products />
      <Specialists />
      <About />
      <ProductFeature />
      <WhyChooseUs />
      <Footer />
    </PageShell>
  );
}
