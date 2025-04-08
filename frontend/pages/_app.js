import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { AppProvider } from '@/context/AppContext';
import '@/styles/globals.css';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

const DefaultLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const NoLayout = ({ children }) => <>{children}</>;

export default function App({ Component, pageProps }) {
  const Layout = Component.layout || DefaultLayout;

  return (
    <AppProvider>
      <style jsx global>{`
        body {
          font-family: ${nunito.style.fontFamily};
        }
      `}</style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
