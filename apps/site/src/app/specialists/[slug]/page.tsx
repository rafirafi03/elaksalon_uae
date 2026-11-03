import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import SpecialistCard from "@/components/SpecialistCard";
import { getSpecialistBySlug, specialists } from "@/lib/specialists";

export async function generateStaticParams() {
  return specialists.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const person = getSpecialistBySlug(slug);
  if (!person) return { title: "Specialist | ELAK" };
  return {
    title: `${person.name} | ELAK Specialists`,
    description: person.bio,
  };
}

export default async function SpecialistDetailPage({ params }: Params) {
  const { slug } = await params;
  const person = getSpecialistBySlug(slug);
  if (!person) notFound();

  const related = specialists.filter((s) => s.slug !== person.slug).slice(0, 3);

  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <Link
            href="/specialists"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            Back to specialists
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] lg:mx-0 lg:rounded-[2.5rem]">
              <Image
                src={person.image}
                alt={person.name}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gold uppercase">{person.experience} experience</p>
              <h1 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">{person.name}</h1>
              <p className="mt-2 text-lg text-gold">{person.role}</p>
              <p className="mt-1 text-sm text-muted">{person.specialty}</p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted lg:text-base">
                {person.bio}
              </p>

              <h2 className="mt-8 font-serif text-xl text-cream">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-cream/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16 lg:mt-20">
              <h2 className="font-serif text-2xl text-cream lg:text-3xl">More specialists</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {related.map((item) => (
                  <SpecialistCard key={item.slug} person={item} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
