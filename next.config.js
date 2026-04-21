const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === "true",

  reactStrictMode: true,

  webpack(config) {
    // Disable Next.js's default SVG asset rule so @svgr/webpack can take over
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
