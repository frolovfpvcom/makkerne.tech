import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Drafts we build for prospective customers live as static files in public/udkast/<name>/.
  async rewrites() {
    return [{ source: "/udkast/:name/", destination: "/udkast/:name/index.html" }];
  },
  // Drafts carry real companies' names, so keep them out of search engines.
  async headers() {
    return [{ source: "/udkast/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
