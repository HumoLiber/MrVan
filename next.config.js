/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  basePath: '/MrVan',
  assetPrefix: '/MrVan/',
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  // Збільшуємо таймаути для більшої стабільності
  httpAgentOptions: {
    keepAlive: true,
  },
  // Запобігаємо обриву сокетів під час розробки
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Запобігаємо частим перезавантаженням
      config.watchOptions = {
        ...config.watchOptions,
        poll: 800, // Перевіряємо зміни кожні 800ms
        aggregateTimeout: 300, // Затримка перед перебудовою
      };
    }
    return config;
  },
} 