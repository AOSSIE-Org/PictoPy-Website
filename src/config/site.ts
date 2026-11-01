/** Site origin used for canonical URLs, the sitemap and structured data. */

/** Production origin of the PictoPy website. */
export const PRODUCTION_SITE_URL = 'https://pictopy.aossie.org';

/**
 * Resolves the site origin without a trailing slash.
 * NEXT_PUBLIC_SITE_URL overrides the production domain (e.g. for PR previews).
 */
export function getSiteUrl(): string {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL;
  return rawSiteUrl.replace(/\/$/, '');
}

/** Site origin resolved once at build time. */
export const SITE_URL = getSiteUrl();
