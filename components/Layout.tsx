import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Хук для отримання перекладів
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

// Компонент для перемикання мов
const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageChange = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
    
    // Зберігаємо вибір користувача в localStorage тільки на клієнті
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', locale);
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
        <span>{languages.find(lang => lang.code === router.locale)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(lang => lang.code === router.locale)?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center w-full px-4 py-2 text-sm ${router.locale === language.code ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Компонент хедера
const Header = () => {
  const translations = useTranslations();
  
  if (!translations) return <div>Loading...</div>;
  
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600">🚐 MrVan</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
            {translations.header.home}
          </Link>
          <Link href="/#features" className="text-gray-700 hover:text-indigo-600 transition-colors">
            {translations.header.features}
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
            {translations.header.contact}
          </Link>
          <LanguageSwitcher />
          <Link href="/login" className="btn-primary">
            {translations.header.login}
          </Link>
        </nav>
        
        <button className="md:hidden text-gray-700 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

// Компонент футера
const Footer = () => {
  const translations = useTranslations();
  
  if (!translations) return <div>Loading...</div>;
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center mb-6">
            <span className="text-3xl font-bold text-white">🚐 MrVan</span>
          </Link>
          
          <p className="text-gray-400 mb-8 text-center">
            {translations.footer.tagline}
          </p>
          
          <div className="flex space-x-4 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            {translations.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

// Інтерфейс для пропсів Layout
interface LayoutProps {
  children: ReactNode;
}

// Головний компонент Layout
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout; 