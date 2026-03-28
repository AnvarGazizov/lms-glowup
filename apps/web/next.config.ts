import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "beta.glowedtech.ai" }],
        destination: "https://www.beta.glowedtech.ai/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
