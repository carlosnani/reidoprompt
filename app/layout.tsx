import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { fetchSiteSettings } from "@/lib/supabase/site-settings";
import { createClient } from "@/lib/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const settings = await fetchSiteSettings(supabase);
  
  return {
    metadataBase: new URL(defaultUrl),
    title: {
      default: settings.default_meta_title,
      template: `%s | ${settings.platform_name}`,
    },
    description: settings.default_meta_description,
    openGraph: {
      title: settings.default_meta_title,
      description: settings.default_meta_description,
      siteName: settings.platform_name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: settings.platform_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.default_meta_title,
      description: settings.default_meta_description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
