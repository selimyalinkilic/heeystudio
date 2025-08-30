import type { Metadata } from 'next';
import { Baloo_Paaji_2 } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

const balooPaaji2 = Baloo_Paaji_2({
  variable: '--font-baloo-paaji-2',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'heey studio',
  description:
    'Innovative creative design portfolio showcase featuring architectural visualization projects.',
  keywords: ['design', 'portfolio', 'creative', 'architectural visualization'],
  authors: [{ name: 'heey studio' }],
  creator: 'heey studio',
  publisher: 'heey studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://heey.studio/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'heey studio',
    description:
      'Innovative creative design portfolio showcase featuring architectural visualization projects.',
    url: 'https://heey.studio/',
    siteName: 'heey studio',
    images: [
      {
        url: '/photo1.jpeg',
        width: 1200,
        height: 630,
        alt: 'heey studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'heey studio',
    description:
      'Innovative creative design portfolio showcase featuring architectural visualization projects.',
    images: ['/photo1.jpeg'],
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
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Additional PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="heey studio" />

        {/* Prevent automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${balooPaaji2.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
