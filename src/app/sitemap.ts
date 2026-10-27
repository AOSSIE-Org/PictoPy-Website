import type { MetadataRoute } from 'next';
import { routing } from '../i18n/routing';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // NEXT_PUBLIC_SITE_URL overrides the production domain (e.g. for PR previews)
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pictopy.aossie.org';
  const baseUrl = rawBaseUrl.replace(/\/$/, '');

  return routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    changeFrequency: 'monthly',
    priority: 1,
  }));
}

