/**
 * @FeatureID Foundation
 * @Purpose Root layout component with fonts, meta tags, and global structure
 * @Spec /docs/DesignSpec.md Section 2, 3, 8
 * @Author Chat Bot Labs
 */

import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false, // Less critical, can load on demand
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Sora Prompting Engine | Build Cinematic Prompts",
  description: "Create high-quality prompts for OpenAI's Sora video model with our step-by-step builder and AI Co-pilot. Master cinematic prompting through guided, educational workflows.",
  keywords: ["Sora", "AI video", "prompt engineering", "cinematic prompts", "OpenAI", "video generation", "AI art"],
  authors: [{ name: "Chat Bot Labs" }],
  creator: "Chat Bot Labs",
  publisher: "Chat Bot Labs",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sora-prompting-engine.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Sora Prompting Engine | Build Cinematic Prompts",
    description: "Create high-quality prompts for OpenAI's Sora video model with our step-by-step builder and AI Co-pilot.",
    url: "/",
    siteName: "Sora Prompting Engine",
    type: "website",
    locale: "en_US",
    // images: [
    //   {
    //     url: "/og-image.png", // Add OG image in Phase 2
    //     width: 1200,
    //     height: 630,
    //     alt: "Sora Prompting Engine",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sora Prompting Engine | Build Cinematic Prompts",
    description: "Create high-quality prompts for OpenAI's Sora video model with our step-by-step builder.",
    // creator: "@chatbotlabs", // Add Twitter handle in Phase 2
    // images: ["/twitter-image.png"], // Add Twitter image in Phase 2
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Add in Phase 2
    // yandex: "your-yandex-verification-code", // Add in Phase 2
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        {/* Skip Links */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-text-inverse focus:rounded-base focus:font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-background-primary"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-text-inverse focus:rounded-base focus:font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-background-primary"
        >
          Skip to navigation
        </a>
        {children}
      </body>
    </html>
  );
}

