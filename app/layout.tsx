import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const site = "https://zyke.in";
const title = "Zyke";
const description =
  "Zyke was an AI marketing agent built at IIT Kharagpur in 2024. It learned a brand's voice, followed what was trending, and produced finished social posts with images you could edit by pointing at them. This is the record of what it was, what it made, and why it stopped.";

// Set these at build time. Both are optional; nothing renders if they are unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: title, template: "%s · Zyke" },
  description,
  applicationName: "Zyke",
  authors: [{ name: "Tasmay P. Tibrewal", url: "https://www.linkedin.com/in/tasmay-tibrewal/" }],
  creator: "Tasmay P. Tibrewal",
  keywords: [
    "Zyke",
    "AI marketing agent",
    "brand voice",
    "trend analysis",
    "generative AI marketing",
    "AI social media content",
    "image inpainting",
    "click to segment",
    "FLUX 1.1 Pro",
    "Grounding DINO",
    "IIT Kharagpur startup",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zyke — an AI marketing agent, 2024",
    description,
    type: "website",
    url: site,
    siteName: "Zyke",
    locale: "en_IN",
    images: [
      { url: "/gallery/nov-delhi-landmarks.jpeg", width: 1024, height: 1024, alt: "A post Zyke generated for Zomato" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyke — an AI marketing agent, 2024",
    description,
    images: ["/gallery/nov-delhi-landmarks.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
};

// Structured data, so search engines and agents get the facts without parsing prose.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: site,
      name: "Zyke",
      description,
      inLanguage: "en",
      publisher: { "@id": `${site}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${site}/#org`,
      name: "Zyke",
      url: site,
      logo: `${site}/icon-512.png`,
      email: "founders@zyke.in",
      foundingDate: "2024-07",
      dissolutionDate: "2024-11",
      foundingLocation: { "@type": "Place", name: "IIT Kharagpur, West Bengal, India" },
      description:
        "Zyke was a generative AI platform that researched a brand, ranked live trends against it, and produced social posts with generated images that could be edited by pointing at them.",
      sameAs: ["https://www.linkedin.com/company/zykelabs/", "https://github.com/zykelabs"],
      founder: [
        { "@type": "Person", name: "Tasmay P. Tibrewal", sameAs: "https://www.linkedin.com/in/tasmay-tibrewal/" },
        { "@type": "Person", name: "Siddharth Dikshit" },
      ],
      member: [
        { "@type": "Person", name: "Rupam Mahato", sameAs: "https://www.linkedin.com/in/rupammahato/" },
      ],
    },
    {
      "@type": "VideoObject",
      name: "Zyke product demo",
      description: "A four-minute walkthrough of Zyke version 1.0, recorded in November 2024.",
      embedUrl: "https://www.youtube-nocookie.com/embed/_z__HdAyjl8",
      url: "https://youtu.be/_z__HdAyjl8",
      uploadDate: "2024-11-01",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        {/* Google Tag Manager, when a container id is configured. */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
        )}
        {/* Google tag (gtag.js) for GA4, when a measurement id is configured. */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
