import localFont from "next/font/local";
import "./globals.css";
import {Inter, Outfit} from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from '@/app/_components/ClientLayout'

// Local fonts for styling
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'ShareVault',
  description: 'Upload, Save and Share your files securely',
  icons: {
    icon: '/favicon.png',
  },
}

const inter = Outfit({subsets: ['latin']})

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} overflow-x-hidden`}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
