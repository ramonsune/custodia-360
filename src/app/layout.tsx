import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from './components/Chatbot';
import CookieConsent from '../components/CookieConsent';
import { FormacionAuthProvider } from '../lib/formacion-auth-context';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Custodia360 - Cumplimiento LOPIVI en 72 horas',
  description: 'Primera empresa con un sistema automatizado de España. Implementamos toda la normativa LOPIVI y planes de protección en 72 horas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={geistSans.className}>
        <FormacionAuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Chatbot />
          <CookieConsent />
          <Toaster richColors position="top-right" />
        </FormacionAuthProvider>
      </body>
    </html>
  );
}
