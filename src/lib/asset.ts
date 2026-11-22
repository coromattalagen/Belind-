/** Prefix public-folder paths with the deploy base (needed for GitHub Pages project sites). */
export const asset = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
