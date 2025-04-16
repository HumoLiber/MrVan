import { GetStaticProps } from 'next';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

// Тимчасова функція перекладу з підтримкою мов
const useTranslation = () => {
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
};

type Role = 'investor' | 'delegatingCompany' | 'delegatingPrivate' | 'collaboratorAgency' | 'collaboratorAgent' | 'vehicleModernization' | 'privateRental';

export default function Signup() {
  const translations = useTranslation();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (!translations) {
    return <div>Loading...</div>;
  }

  // Обробник для вибору ролі
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  // Обробник для кнопки "Продовжити"
  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboarding/${selectedRole}`);
    }
  };
  
  // Обробник для кнопки "Назад"
  const handleBack = () => {
    router.push('/');
  };

  const roles = [
    {
      id: 'investor',
      title: translations.signup?.roles?.investor?.title || 'Investor',
      description: translations.signup?.roles?.investor?.description || 'Invest in campers and receive profit',
      icon: '💼'
    },
    {
      id: 'delegatingCompany',
      title: translations.signup?.roles?.company?.title || 'Company Owner',
      description: translations.signup?.roles?.company?.description || 'Delegate the management of your campers',
      icon: '🏢'
    },
    {
      id: 'delegatingPrivate',
      title: translations.signup?.roles?.private?.title || 'Private Owner',
      description: translations.signup?.roles?.private?.description || 'Delegate the management of your camper',
      icon: '🚐'
    },
    {
      id: 'collaboratorAgency',
      title: translations.signup?.roles?.agency?.title || 'Collaborator Agency',
      description: translations.signup?.roles?.agency?.description || 'Collaborate with MrVan as an agency',
      icon: '🤝'
    },
    {
      id: 'collaboratorAgent',
      title: translations.signup?.roles?.agent?.title || 'Collaborator Agent',
      description: translations.signup?.roles?.agent?.description || 'Collaborate with MrVan as an individual agent',
      icon: '👥'
    },
    {
      id: 'vehicleModernization',
      title: translations.signup?.roles?.modernization?.title || 'Vehicle Modernization',
      description: translations.signup?.roles?.modernization?.description || 'Request advanced vehicle equipment installation',
      icon: '🔌'
    },
    {
      id: 'privateRental',
      title: translations.signup?.roles?.rental?.title || 'Private Rental',
      description: translations.signup?.roles?.rental?.description || 'Rent out your personal vehicle',
      icon: '🔄'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>{translations.signup?.title || 'Sign Up'} | MrVan</title>
        <meta name="description" content="Choose your role in MrVan B2B platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
                {translations.signup?.title || 'Choose your role'}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as Role)}
                    className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      selectedRole === role.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                    }`}
                  >
                    <div className="text-3xl mb-4">{role.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  {translations.signup?.back || 'Back'}
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selectedRole}
                  className={`btn-primary ${!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {translations.signup?.continue || 'Continue'}
                </button>
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
      // ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}; 