import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The examples' stock photos are fetched by our own server, never by the visitor's browser.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" }],
    qualities: [75],
  },
  // Drafts we build for prospective customers live as static files in public/udkast/<name>/.
  async rewrites() {
    return [{ source: "/udkast/:name/", destination: "/udkast/:name/index.html" }];
  },
  // The examples used to have their own page; they now live on the front page, above the price.
  async redirects() {
    return [
      { source: "/eksempler", destination: "/#eksempler", permanent: true },
      { source: "/cookies", destination: "/privatliv/#cookies", permanent: true },
      { source: "/privatlivspolitik", destination: "/privatliv/", permanent: true },
      { source: "/handelsbetingelser", destination: "/vilkaar/", permanent: true },
    ];
  },
  // Drafts carry real companies' names, so keep them out of search engines.
  async headers() {
    return [{ source: "/udkast/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
