import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MainHeader } from "@/components/MainHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Federated Learning Simulation",
  description: "A demonstration of collaborative machine learning across hospitals while preserving data privacy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider defaultTheme="system">
          <div className="relative flex min-h-screen flex-col">
            <MainHeader />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
