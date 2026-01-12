import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['fr', 'en'].includes(locale)) {
    locale = 'fr'; // Default to French
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});