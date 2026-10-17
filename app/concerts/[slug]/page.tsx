import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { events } from "@/app/content";
import Concert from "@/components/Concert";

export function generateStaticParams() {
  return events.filter((e) => e.status === "upcoming").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  if (!e) return {};
  const description = `${e.lineup.map((b) => b.name).join(" · ")} — ${e.date} · ${e.venue}, ${e.city}`;
  return {
    title: `${e.title} — L'Ombra del Coliseu`,
    description,
    openGraph: { title: e.title, description, images: e.poster ? [e.poster] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  if (!e) notFound();
  return <Concert slug={e.slug} />;
}
