import Footer from '../Footer';
import { LanguageProvider } from '@/lib/i18n';

export default function FooterExample() {
  return (
    <LanguageProvider>
      <Footer />
    </LanguageProvider>
  );
}
