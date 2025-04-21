import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SuccessPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>Registration Successful | MrVan</title>
        <meta name="description" content="Your registration with MrVan was successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ✅ Реєстрацію успішно завершено!
              </h1>
              
              <p className="text-gray-600 mb-8">
                Дякуємо за реєстрацію в системі Mr.Van. Ваші дані успішно збережені в базі даних Supabase.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md mb-8 text-left">
                <h3 className="font-medium text-blue-800 mb-2">🔍 Що далі?</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Перевірте електронну пошту для підтвердження реєстрації</li>
                  <li>Дочекайтеся верифікації вашого акаунту (зазвичай протягом 24 годин)</li>
                  <li>Підготуйте документи для підписання договору</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <Link href="/" className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition duration-200">
                  Повернутися на головну
                </Link>
                
                <div className="text-sm text-gray-500 mt-4">
                  Виникли запитання? Зв'яжіться з нами <a href="mailto:support@mistervan.es" className="text-indigo-600 hover:underline">support@mistervan.es</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}; 