import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Toaster } from 'sonner';

const locales = ['fr', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages directly
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}