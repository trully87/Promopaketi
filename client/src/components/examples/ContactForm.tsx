import ContactForm from '../ContactForm';
import { LanguageProvider } from '@/lib/i18n';

export default function ContactFormExample() {
  return (
    <LanguageProvider>
      <ContactForm />
    </LanguageProvider>
  );
}
