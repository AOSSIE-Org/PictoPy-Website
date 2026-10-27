import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { routing } from "@/i18n/routing";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";
import ShuffleGrid from "@/components/ShuffleGrid";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/context/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  return generateLocaleMetadata(locale, "Home");
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params since PageProps and LayoutProps are Promises in Next.js 15/16
  const { locale } = await params;

  // Validate that the incoming `locale` is supported
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  // Provide messages to Client Components
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${devanagari.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <LenisProvider>
              <main className="relative min-h-screen bg-bg text-text">
                <ShuffleGrid />
                <div className="relative z-10 bg-transparent text-text py-4 px-4 min-[1250px]:px-29.5">
                  <Navbar />
                  {children}{" "}
                </div>
              </main>
            </LenisProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
