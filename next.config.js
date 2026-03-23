const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: '.next',
  productionBrowserSourceMaps: true,
  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/styleguide`.
    defaultLocale: 'en'
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
};

module.exports = nextConfig;
