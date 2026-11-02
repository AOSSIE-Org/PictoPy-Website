import type { MetadataRoute } from 'next';
import { routing } from '../i18n/routing';
import { getSiteUrl } from '@/config/site';
import { LEGAL_PAGES } from '@/config/legal';
import { SUPPORT_PAGE_PATH } from '@/config/support';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // NEXT_PUBLIC_SITE_URL overrides the production domain (e.g. for PR previews)
  const baseUrl = getSiteUrl();

  return routing.locales.flatMap((locale): MetadataRoute.Sitemap => [
    {
      url: `${baseUrl}/${locale}`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...[...Object.values(LEGAL_PAGES).map((page) => page.path), SUPPORT_PAGE_PATH].map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]);
}

