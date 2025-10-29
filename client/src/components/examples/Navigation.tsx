import Navigation from '../Navigation';
import { LanguageProvider } from '@/lib/i18n';

export default function NavigationExample() {
  return (
    <LanguageProvider>
      <Navigation />
    </LanguageProvider>
  );
}
