import type { Metadata } from "next";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import MapSection from "@/components/Map";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact | ELAK Men's Salon UAE",
  description: "Get in touch with ELAK — book your visit and find our salon location in the UAE.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <Header />
      <main className="pt-24 lg:pt-28">
        <Contact />
        <ContactForm />
        <MapSection />
      </main>
      <Footer />
    </PageShell>
  );
}
