import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FoodHub — Order Fresh Meals Online",
    template: "%s | FoodHub",
  },
  description:
    "Discover authentic Bangladeshi cuisine and more from top local restaurants. Order fresh, hot meals delivered to your doorstep in under 30 minutes.",
  keywords: [
    "food delivery",
    "bangladeshi food",
    "restaurant",
    "online food order",
    "dhaka food",
  ],
  openGraph: {
    title: "FoodHub — Order Fresh Meals Online",
    description:
      "Discover authentic Bangladeshi cuisine and more from top local restaurants.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
