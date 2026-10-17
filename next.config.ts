import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Drafts we build for prospective customers live as static files in public/udkast/<name>/.
  async rewrites() {
    return [{ source: "/udkast/:name/", destination: "/udkast/:name/index.html" }];
  },
  // The examples used to have their own page; they now live on the front page, above the price.
  async redirects() {
    return [{ source: "/eksempler", destination: "/#eksempler", permanent: true }];
  },
  // Drafts carry real companies' names, so keep them out of search engines.
  async headers() {
    return [{ source: "/udkast/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
