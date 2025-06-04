
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'OmniTool',
  description: 'All-in-one utility application',
  manifest: '/manifest.json', // Added for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        {/* Link to manifest.json for PWA capabilities - can also be in Metadata */}
        {/* <link rel="manifest" href="/manifest.json" /> */} 
        <meta name="theme-color" content="#2196F3" /> {/* Theme color for PWA */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
