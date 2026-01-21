import type { Metadata } from "next";
import "@fontsource/crimson-pro/400.css";
import "@fontsource/crimson-pro/700.css";
import "@fontsource/crimson-pro/400-italic.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FON Raspored | Evidencija nastave",
  description: "Zvanična platforma za evidenciju prisustva i pregled rasporeda nastave na Fakultetu organizacionih nauka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
