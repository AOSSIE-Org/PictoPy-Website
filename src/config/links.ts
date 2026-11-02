/** External links used across the site. Never hard-code URLs in components. */
import { PRODUCTION_SITE_URL } from '@/config/site';

// AOSSIE (parent organisation)
export const AOSSIE_URL = 'https://aossie.org';
export const AOSSIE_EN_URL = `${AOSSIE_URL}/en`;
export const AOSSIE_PROJECTS_URL = `${AOSSIE_URL}/en/projects`;
export const AOSSIE_GITHUB_URL = 'https://github.com/AOSSIE-Org';
// Donations to AOSSIE, linked from the support page
export const GITHUB_SPONSORS_URL = 'https://github.com/sponsors/AOSSIE-Org';
// Google Summer of Code, listed as a supporter on the support page
export const GSOC_URL = 'https://summerofcode.withgoogle.com';

// PictoPy repository
export const REPO_URL = `${AOSSIE_GITHUB_URL}/PictoPy`;
export const REPO_README_URL = `${REPO_URL}/blob/main/README.md`;
export const REPO_CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
export const REPO_ISSUES_URL = `${REPO_URL}/issues`;
export const REPO_LATEST_RELEASE_URL = `${REPO_URL}/releases/latest`;

// PictoPy website (always the production domain, even on previews)
export const WEBSITE_URL = PRODUCTION_SITE_URL;

// Sibling projects and umbrella organisations
export const RESONATE_REPO_URL = `${AOSSIE_GITHUB_URL}/Resonate`;
export const DJED_URL = 'https://djed.one/';
export const STABILITY_NEXUS_URL = 'https://stability.nexus/';

// Community and social profiles
export const SOCIAL_LINKS = {
  discord: 'https://discord.com/channels/1022871757289422898/1311271974630330388',
  github: REPO_URL,
  youtube: 'https://www.youtube.com/@AOSSIE-Org',
  x: 'https://x.com/aossie_org',
  linkedin: 'https://www.linkedin.com/company/aossie/',
} as const;
