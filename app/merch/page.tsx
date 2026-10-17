import type { Metadata } from "next";
import MerchPage from "@/components/MerchPage";

export const metadata: Metadata = {
  title: "Ombra Harvest — Merch · L'Ombra del Coliseu",
  description: "Official merch of L'Ombra del Coliseu: tank tops, mugs and pre-orders. Pick-up at our concerts or shipping in Spain and Europe.",
};

export default function Page() {
  return <MerchPage />;
}
