import { GetStaticProps } from 'next';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../app/components/Layout';

// Тимчасова функція перекладу з підтримкою мов
const t = (key: string) => {
  const router = useRouter();
  const locale = router.locale || 'en';
  
  const translations: {[locale: string]: {[key: string]: string}} = {
    en: {
      'roles.title': 'Choose your role',
      'roles.investor.title': 'Investor',
      'roles.investor.description': 'Invest in campers and receive profit',
      'roles.delegatingCompany.title': 'Company Owner',
      'roles.delegatingCompany.description': 'Delegate the management of your campers',
      'roles.delegatingPrivate.title': 'Private Owner',
      'roles.delegatingPrivate.description': 'Delegate the management of your camper',
      'roles.collaboratorAgency.title': 'Collaborator Agency',
      'roles.collaboratorAgency.description': 'Collaborate with MrVan as an agency',
      'roles.collaboratorAgent.title': 'Collaborator Agent',
      'roles.collaboratorAgent.description': 'Collaborate with MrVan as an individual agent',
      'roles.continue': 'Continue',
      'roles.back': 'Back'
    },
    uk: {
      'roles.title': 'Оберіть вашу роль',
      'roles.investor.title': 'Інвестор',
      'roles.investor.description': 'Інвестуйте в кемпери та отримуйте прибуток',
      'roles.delegatingCompany.title': 'Компанія-власник',
      'roles.delegatingCompany.description': 'Делегуйте управління вашими кемперами',
      'roles.delegatingPrivate.title': 'Приватний власник',
      'roles.delegatingPrivate.description': 'Делегуйте управління вашим кемпером',
      'roles.collaboratorAgency.title': 'Агентство-співробітник',
      'roles.collaboratorAgency.description': 'Співпрацюйте з MrVan як агентство',
      'roles.collaboratorAgent.title': 'Агент-співробітник',
      'roles.collaboratorAgent.description': 'Співпрацюйте з MrVan як індивідуальний агент',
      'roles.continue': 'Продовжити',
      'roles.back': 'Назад'
    },
    es: {
      'roles.title': 'Elige tu rol',
      'roles.investor.title': 'Inversor',
      'roles.investor.description': 'Invierte en autocaravanas y recibe beneficios',
      'roles.delegatingCompany.title': 'Propietario de Empresa',
      'roles.delegatingCompany.description': 'Delega la gestión de tus autocaravanas',
      'roles.delegatingPrivate.title': 'Propietario Privado',
      'roles.delegatingPrivate.description': 'Delega la gestión de tu autocaravana',
      'roles.collaboratorAgency.title': 'Agencia Colaboradora',
      'roles.collaboratorAgency.description': 'Colabora con MrVan como agencia',
      'roles.collaboratorAgent.title': 'Agente Colaborador',
      'roles.collaboratorAgent.description': 'Colabora con MrVan como agente individual',
      'roles.continue': 'Continuar',
      'roles.back': 'Atrás'
    },
    fr: {
      'roles.title': 'Choisissez votre rôle',
      'roles.investor.title': 'Investisseur',
      'roles.investor.description': 'Investissez dans des camping-cars et recevez des bénéfices',
      'roles.delegatingCompany.title': 'Propriétaire d\'Entreprise',
      'roles.delegatingCompany.description': 'Déléguez la gestion de vos camping-cars',
      'roles.delegatingPrivate.title': 'Propriétaire Privé',
      'roles.delegatingPrivate.description': 'Déléguez la gestion de votre camping-car',
      'roles.collaboratorAgency.title': 'Agence Collaboratrice',
      'roles.collaboratorAgency.description': 'Collaborez avec MrVan en tant qu\'agence',
      'roles.collaboratorAgent.title': 'Agent Collaborateur',
      'roles.collaboratorAgent.description': 'Collaborez avec MrVan en tant qu\'agent individuel',
      'roles.continue': 'Continuer',
      'roles.back': 'Retour'
    },
    it: {
      'roles.title': 'Scegli il tuo ruolo',
      'roles.investor.title': 'Investitore',
      'roles.investor.description': 'Investi in camper e ricevi profitti',
      'roles.delegatingCompany.title': 'Proprietario di Azienda',
      'roles.delegatingCompany.description': 'Delega la gestione dei tuoi camper',
      'roles.delegatingPrivate.title': 'Proprietario Privato',
      'roles.delegatingPrivate.description': 'Delega la gestione del tuo camper',
      'roles.collaboratorAgency.title': 'Agenzia Collaboratrice',
      'roles.collaboratorAgency.description': 'Collabora con MrVan come agenzia',
      'roles.collaboratorAgent.title': 'Agente Collaboratore',
      'roles.collaboratorAgent.description': 'Collabora con MrVan come agente individuale',
      'roles.continue': 'Continua',
      'roles.back': 'Indietro'
    },
    ca: {
      'roles.title': 'Escull el teu rol',
      'roles.investor.title': 'Inversor',
      'roles.investor.description': 'Inverteix en autocaravanes i rep beneficis',
      'roles.delegatingCompany.title': 'Propietari d\'Empresa',
      'roles.delegatingCompany.description': 'Delega la gestió de les teves autocaravanes',
      'roles.delegatingPrivate.title': 'Propietari Privat',
      'roles.delegatingPrivate.description': 'Delega la gestió de la teva autocaravana',
      'roles.collaboratorAgency.title': 'Agència Col·laboradora',
      'roles.collaboratorAgency.description': 'Col·labora amb MrVan com a agència',
      'roles.collaboratorAgent.title': 'Agent Col·laborador',
      'roles.collaboratorAgent.description': 'Col·labora amb MrVan com a agent individual',
      'roles.continue': 'Continuar',
      'roles.back': 'Tornar'
    }
  };
  
  // Якщо мова відсутня, використовуємо англійську
  const localeTranslations = translations[locale] || translations.en;
  return localeTranslations[key] || key;
};

type Role = 'investor' | 'delegatingCompany' | 'delegatingPrivate' | 'collaboratorAgency' | 'collaboratorAgent';

export default function Signup() {
  // const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

  return (
    <Layout>
      <Head>
        <title>{t('roles.title')} | MrVan</title>
        <meta name="description" content="Choose your role in MrVan B2B platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
                {t('roles.title')}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {/* Investor */}
                <div 
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'investor' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                  }`}
                  onClick={() => handleRoleSelect('investor')}
                >
                  <div className="text-3xl mb-4">💼</div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    {t('roles.investor.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('roles.investor.description')}
                  </p>
                </div>

                {/* Delegating Company Owner */}
                <div 
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'delegatingCompany' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                  }`}
                  onClick={() => handleRoleSelect('delegatingCompany')}
                >
                  <div className="text-3xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    {t('roles.delegatingCompany.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('roles.delegatingCompany.description')}
                  </p>
                </div>

                {/* Delegating Private Owner */}
                <div 
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'delegatingPrivate' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                  }`}
                  onClick={() => handleRoleSelect('delegatingPrivate')}
                >
                  <div className="text-3xl mb-4">🚐</div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    {t('roles.delegatingPrivate.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('roles.delegatingPrivate.description')}
                  </p>
                </div>

                {/* Collaborator Agency */}
                <div 
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'collaboratorAgency' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                  }`}
                  onClick={() => handleRoleSelect('collaboratorAgency')}
                >
                  <div className="text-3xl mb-4">🏪</div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    {t('roles.collaboratorAgency.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('roles.collaboratorAgency.description')}
                  </p>
                </div>

                {/* Collaborator Agent */}
                <div 
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                    selectedRole === 'collaboratorAgent' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                  }`}
                  onClick={() => handleRoleSelect('collaboratorAgent')}
                >
                  <div className="text-3xl mb-4">👨‍💼</div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                    {t('roles.collaboratorAgent.title')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('roles.collaboratorAgent.description')}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  {t('roles.back')}
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selectedRole}
                  className={`btn-primary ${!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {t('roles.continue')}
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