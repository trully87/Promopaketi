import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'me' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  me: {
    // Navigation
    'nav.home': 'Početna',
    'nav.newyear': 'Novogodišnji paketi',
    'nav.corporate': 'Korporativni paketi',
    'nav.about': 'O nama',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.title': 'Premium Poklon Paketi',
    'hero.subtitle': 'Jedinstveni novogodišnji i korporativni pokloni sa personalizacijom',
    'hero.cta.view': 'Pogledaj pakete',
    'hero.cta.contact': 'Kontaktirajte nas',
    
    // Categories
    'category.newyear': 'Novogodišnji Paketi',
    'category.newyear.desc': 'Ekskluzivni novogodišnji pokloni sa custom made kutijama',
    'category.corporate': 'Korporativni Paketi',
    'category.corporate.desc': 'Profesionalni poslovni pokloni za Vašu firmu',
    
    // Packages
    'package.basic.newyear': 'Osnovni Novogodišnji Paket',
    'package.standard.newyear': 'Standardni Novogodišnji Paket',
    'package.premium.thermos': 'Premium Paket sa Termosom',
    'package.premium.olive': 'Premium Paket sa Maslinovim Uljem',
    'package.basic.corporate.bag': 'Osnovni Korporativni Paket sa Kesom',
    'package.basic.corporate.box': 'Osnovni Korporativni Paket sa Kutijom',
    'package.active.life': 'Active Life',
    'package.smart.living': 'Smart Living',
    'package.eco.friendly': 'Eko Održivi Paket',
    
    // Common
    'common.price': 'Cijena',
    'common.from': 'od',
    'common.perUnit': 'po komadu',
    'common.minOrder': 'Minimalna narudžba',
    'common.pieces': 'komada',
    'common.includes': 'Paket uključuje',
    'common.learnMore': 'Saznaj više',
    'common.inquire': 'Pošalji upit',
    'common.customization': 'Personalizacija',
    
    // Contact Form
    'form.title': 'Kontaktirajte Nas',
    'form.subtitle': 'Pošaljite nam upit i odgovorićemo Vam u najkraćem roku',
    'form.name': 'Ime i prezime',
    'form.email': 'Email adresa',
    'form.phone': 'Telefon',
    'form.company': 'Kompanija',
    'form.package': 'Odaberite paket',
    'form.quantity': 'Količina',
    'form.message': 'Poruka',
    'form.submit': 'Pošalji upit',
    'form.success': 'Upit uspješno poslat!',
    
    // Footer
    'footer.tagline': 'Premium poklon paketi sa personalizacijom',
    'footer.quick.links': 'Brzi linkovi',
    'footer.contact.info': 'Kontakt informacije',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter.subtitle': 'Prijavite se za novosti i promocije',
    'footer.subscribe': 'Prijavi se',
    'footer.rights': 'Sva prava zadržana',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.newyear': "New Year's Packages",
    'nav.corporate': 'Corporate Packages',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Premium Gift Packages',
    'hero.subtitle': 'Unique New Year and corporate gifts with personalization',
    'hero.cta.view': 'View Packages',
    'hero.cta.contact': 'Contact Us',
    
    // Categories
    'category.newyear': "New Year's Packages",
    'category.newyear.desc': 'Exclusive New Year gifts with custom made boxes',
    'category.corporate': 'Corporate Packages',
    'category.corporate.desc': 'Professional business gifts for your company',
    
    // Packages
    'package.basic.newyear': "Basic New Year's Package",
    'package.standard.newyear': "Standard New Year's Package",
    'package.premium.thermos': 'Premium Package with Thermos',
    'package.premium.olive': 'Premium Package with Olive Oil',
    'package.basic.corporate.bag': 'Basic Corporate Package with Bag',
    'package.basic.corporate.box': 'Basic Corporate Package with Box',
    'package.active.life': 'Active Life',
    'package.smart.living': 'Smart Living',
    'package.eco.friendly': 'Eco Sustainable Package',
    
    // Common
    'common.price': 'Price',
    'common.from': 'from',
    'common.perUnit': 'per unit',
    'common.minOrder': 'Minimum order',
    'common.pieces': 'pieces',
    'common.includes': 'Package includes',
    'common.learnMore': 'Learn More',
    'common.inquire': 'Send Inquiry',
    'common.customization': 'Customization',
    
    // Contact Form
    'form.title': 'Contact Us',
    'form.subtitle': 'Send us an inquiry and we will respond shortly',
    'form.name': 'Full Name',
    'form.email': 'Email Address',
    'form.phone': 'Phone',
    'form.company': 'Company',
    'form.package': 'Select Package',
    'form.quantity': 'Quantity',
    'form.message': 'Message',
    'form.submit': 'Send Inquiry',
    'form.success': 'Inquiry sent successfully!',
    
    // Footer
    'footer.tagline': 'Premium gift packages with personalization',
    'footer.quick.links': 'Quick Links',
    'footer.contact.info': 'Contact Information',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter.subtitle': 'Subscribe for news and promotions',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('me');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.me] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
