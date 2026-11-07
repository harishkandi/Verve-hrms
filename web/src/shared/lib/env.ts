/**
 * Preview builds (`npm run build:preview`, used by the Vercel staging site)
 * run without any backend: apps that would call an API use built-in sample
 * data instead, and the top bar says so.
 */
export const isPreview = import.meta.env.MODE === 'preview'
