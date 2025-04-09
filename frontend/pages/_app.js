import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { AppProvider } from '@/context/AppContext';
import '@/styles/globals.css';

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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
