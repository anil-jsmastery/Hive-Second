import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/ui/themes';
import './globals.css';
import { GlowDefs } from '@/components/night/glow-defs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { AnalyticsIdentity } from '@/components/analytics/analytics-identity';
import { getCurrentProfile } from '@/lib/profile';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hive · Skills for AI agents',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const profile = await getCurrentProfile();
  return (
    <ClerkProvider
      appearance={{ theme: shadcn, elements: { cardBox: 'hive-clerk-card', formButtonPrimary: 'hive-clerk-primary', userButtonAvatarBox: 'hive-clerk-avatar' } }}
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
          <GlowDefs />
          <SiteHeader />
          <main className="app">{children}</main>
          <SiteFooter />
          <AnalyticsIdentity stack={profile?.stack ?? null} />
          <Toaster position="bottom-center" toastOptions={{ className: 'hive-toast' }} />
        </body>
      </html>
    </ClerkProvider>
  );
}
