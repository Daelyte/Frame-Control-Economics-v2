import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import './performance.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Frame Economics — Master Behavioral Psychology & Influence',
    template: '%s | Frame Economics',
  },
  description: 'Master behavioral psychology and influence through advanced frame control techniques. Transform your understanding of human psychology with cutting-edge learning tools.',
  keywords: [
    'behavioral psychology',
    'frame control',
    'influence techniques',
    'psychology education',
    'behavioral economics',
    'decision making',
  ],
  authors: [{ name: 'Frame Economics' }],
  creator: 'Frame Economics',
  metadataBase: new URL('https://frame-control.netlify.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://frame-control.netlify.app',
    siteName: 'Frame Economics',
    title: 'Frame Economics — Master Behavioral Psychology & Influence',
    description: 'Master behavioral psychology and influence through advanced frame control techniques.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Frame Economics - Behavioral Psychology Education',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frame Economics — Master Behavioral Psychology & Influence',
    description: 'Master behavioral psychology and influence through advanced frame control techniques.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://frame-control.netlify.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F3B38" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Frame Economics",
              "description": "Master behavioral psychology and influence through advanced frame control techniques.",
              "url": "https://frame-control.netlify.app",
              "logo": "https://frame-control.netlify.app/logo.png",
              "sameAs": [
                // Add social media URLs here
              ],
              "offers": {
                "@type": "Course",
                "name": "Frame Control & Behavioral Psychology",
                "description": "Advanced behavioral psychology education and influence techniques",
                "provider": {
                  "@type": "Organization",
                  "name": "Frame Economics"
                }
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen text-white antialiased" style={{ background: 'linear-gradient(to bottom, var(--color-primary-dark), var(--color-bg-dark), var(--color-primary-dark))' }}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}