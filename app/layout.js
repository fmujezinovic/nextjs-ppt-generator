import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
  display: "swap", // Dodano za boljšo optimizacijo nalaganja fonta
});

export const metadata = {
  title: "Slides generator",
  description: "Make your slides fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
