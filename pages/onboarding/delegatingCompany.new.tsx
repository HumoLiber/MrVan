import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

export default function DelegatingCompanyOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // Redirect to the first step of the new flow
  useEffect(() => {
    router.replace('/onboarding/companyInfo');
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Company Onboarding | MrVan</title>
        <meta name="description" content="Register your company's campers with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                🏢 Company Registration
              </h1>
              <p className="text-gray-600 mb-4">
                Redirecting to the new registration flow...
              </p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
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
