import type { Metadata, Viewport } from "next";
import "@fontsource/unifrakturmaguntia/400.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'Ombra del Coliseu · Underground collective · Tarragona",
  description:
    "Black metal, gothic, post-punk and industrial concerts in Tarragona. Uncompromising sound since the depths.",
};

export const viewport: Viewport = { themeColor: "#070606" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
