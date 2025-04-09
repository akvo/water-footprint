import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { AppProvider } from '@/context/AppContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AppProvider>
  );
}
