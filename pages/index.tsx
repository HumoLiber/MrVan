import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

// Створюємо функцію для отримання перекладів відповідно до локалі
function useTranslations() {
  const router = useRouter();
  const { locale } = router;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    // Завантажуємо переклади для поточної локалі
    import(`../public/locales/${locale}/common.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch(() => {
        // Якщо переклад не знайдено, використовуємо англійську
        import(`../public/locales/en/common.json`).then((module) => {
          setTranslations(module.default);
        });
      });
  }, [locale]);

  return translations;
}

export default function Home() {
  const translations = useTranslations();

  if (!translations) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>MrVan - Camper Management Platform</title>
        <meta name="description" content="MrVan - B2B platform for camper management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {translations.hero.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {translations.hero.description}
            </p>
            <Link href="/signup" className="btn-primary text-lg">
              {translations.hero.getStarted}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-bg-alt">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translations.features.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {translations.features.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.tailored.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.tailored.description}
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.allInclusive.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.allInclusive.description}
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">🔑</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.flexibility.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.flexibility.description}
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.onlineHiring.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.onlineHiring.description}
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.bestOffers.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.bestOffers.description}
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {translations.features.assistance.title}
              </h3>
              <p className="text-gray-600">
                {translations.features.assistance.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {translations.cta.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {translations.cta.description}
          </p>
          <Link href="/signup" className="btn-primary text-lg">
            {translations.cta.button}
          </Link>
        </div>
      </section>
    </Layout>
  );
} 