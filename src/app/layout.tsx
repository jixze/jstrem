// src/app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar"; // make sure you have this component
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export const metadata = {
  title: "JStrem",
  description: "Stream your favorite movies and TV shows",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Keep body static to prevent hydration mismatch */}
      <body
        className={`antialiased bg-black text-white ${inter.variable} ${robotoMono.variable}`}
        suppressHydrationWarning={true} // avoids SSR/CSR mismatch warnings
      >
        {/* Navbar always rendered on client */}
        <Navbar />

        {/* Main page content */}
        <div>{children}</div>
      </body>
    </html>
  );
}
