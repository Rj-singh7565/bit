import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buddha Institute of Technology (BIT) Gorakhpur | ERP & Academic Portal",
  description: "Official portal of Buddha Institute of Technology (BIT) Gorakhpur. Affiliated to AKTU, approved by AICTE. Access student records, placements statistics, digital library, and online fee management.",
  keywords: ["BIT Gorakhpur", "Buddha Institute of Technology", "AKTU College Gorakhpur", "Engineering Gorakhpur", "BIT Gorakhpur ERP", "BGI Gorakhpur"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-bit-dark bg-white">
        {children}
      </body>
    </html>
  );
}
