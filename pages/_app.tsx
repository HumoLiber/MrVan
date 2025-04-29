import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  useEffect(() => {
    // Перевіряємо збережену мову користувача тільки на клієнті
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      
      if (savedLanguage && router.locale !== savedLanguage) {
        // Замість router.push використовуємо window.location для статичного експорту
        window.location.href = `/${savedLanguage}${router.asPath}`;
      }
    }
  }, [router]);
  
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp); 