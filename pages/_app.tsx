import '../app/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  useEffect(() => {
    // Перевіряємо збережену мову користувача тільки на клієнті
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      
      if (savedLanguage && router.locale !== savedLanguage) {
        // Якщо у користувача збережена мова і вона відрізняється від поточної, перенаправляємо
        router.push(router.pathname, router.asPath, { locale: savedLanguage });
      }
    }
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp; 