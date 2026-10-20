export default function robots() {
  const rawBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const baseUrl = rawBaseUrl
    ? (rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")
        ? rawBaseUrl
        : `https://${rawBaseUrl}`)
    : "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

