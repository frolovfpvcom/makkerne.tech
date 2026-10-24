import type { NextConfig } from "next";

// Proposals with their own free address: the host's front page is the proposal itself.
const OWN = [
  { host: "brobech-forslag.vercel.app", name: "brobechv2" },
  { host: "bronkebyg.vercel.app", name: "bronkebyg" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The examples' stock photos are fetched by our own server, never by the visitor's browser.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" }],
    qualities: [75],
  },
  // Drafts we build for prospective customers live as static files in public/udkast/<name>/, and
  // proposals for real customers in public/demo/<name>/.
  // A proposal can also get its own free address (a *.vercel.app domain on this project), whose
  // front page is the proposal itself. Links inside it keep their /demo/<name>/ paths.
  async rewrites() {
    const own = OWN;
    return {
      beforeFiles: own.map(({ host, name }) => ({
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `/demo/${name}/index.html`,
      })),
      afterFiles: [
        { source: "/udkast/:name/", destination: "/udkast/:name/index.html" },
        { source: "/demo/:name/", destination: "/demo/:name/index.html" },
        { source: "/demo/:name/:page/", destination: "/demo/:name/:page/index.html" },
        { source: "/demo/:name/:page/:sub/", destination: "/demo/:name/:page/:sub/index.html" },
      ],
    };
  },
  // The menu's examples page is /eksempelsider/. /eksempler once redirected permanently to the
  // front page, and browsers keep that, so the page got a new path instead of reusing the old one.
  async redirects() {
    return [
      { source: "/eksempler", destination: "/eksempelsider/", permanent: false },
      { source: "/cookies", destination: "/privatliv/#cookies", permanent: true },
      { source: "/privatlivspolitik", destination: "/privatliv/", permanent: true },
      { source: "/handelsbetingelser", destination: "/vilkaar/", permanent: true },
    ];
  },
  // Drafts and demos carry real companies' names, so keep them out of search engines.
  async headers() {
    return [
      { source: "/udkast/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/demo/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      ...OWN.map(({ host }) => ({ source: "/:path*", has: [{ type: "host" as const, value: host }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
    ];
  },
};

export default nextConfig;
