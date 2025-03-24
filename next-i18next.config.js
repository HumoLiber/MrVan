module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ca', 'it', 'fr'],
    localeDetection: true,
  },
  localePath: 'public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 