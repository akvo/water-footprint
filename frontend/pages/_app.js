import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { AppProvider } from '@/context/AppContext';
import '@/styles/globals.css';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <style jsx global>{`
        body {
          font-family: ${nunito.style.fontFamily};
        }
      `}</style>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AppProvider>
  );
}
