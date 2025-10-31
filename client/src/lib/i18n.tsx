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
    'hero.title': 'Vaš Partner za Kompletna Poslovna Rješenja',
    'hero.subtitle': 'Razumijemo, dizajniramo i realizujemo Vaše projekte poklonpaketa. Od ideje do isporuke - kompletan pristup koji osigurava uspjeh.',
    'hero.cta.view': 'Istražite pakete',
    'hero.cta.contact': 'Razgovarajmo',
    
    // Categories
    'category.newyear': 'Novogodišnji Paketi',
    'category.newyear.desc': 'Kurirana kolekcija luksuznih novogodišnjih poklona. Od ideje do isporuke - sveobuhvatno rješenje koje ostavlja upečatljiv dojam.',
    'category.corporate': 'Korporativni Paketi',
    'category.corporate.desc': 'Strateška poslovna rješenja koja jačaju Vaš brend. Precizan dizajn i impresivna realizacija za rezultate koji se mjere.',
    'category.eko': 'Eko Paketi',
    'category.eko.desc': 'Održiva rješenja koja odražavaju Vaše vrijednosti. Autentični lokalni proizvodi sa premium prezentacijom.',
    
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
    'footer.tagline': 'End-to-end rješenja za Vaše korporativne i novogodišnje poklone. Partnerski pristup koji donosi rezultate.',
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
    'hero.title': 'Your Partner for Complete Business Solutions',
    'hero.subtitle': 'We understand, design and deliver your gift package projects. From concept to delivery - a comprehensive approach ensuring success.',
    'hero.cta.view': 'Explore Packages',
    'hero.cta.contact': 'Let\'s Talk',
    
    // Categories
    'category.newyear': "New Year's Packages",
    'category.newyear.desc': 'Curated collection of luxury New Year gifts. From concept to delivery - comprehensive solution leaving lasting impression.',
    'category.corporate': 'Corporate Packages',
    'category.corporate.desc': 'Strategic business solutions strengthening your brand. Precise design and impressive execution delivering measurable results.',
    'category.eko': 'Eco Packages',
    'category.eko.desc': 'Sustainable solutions reflecting your values. Authentic local products with premium presentation.',
    
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
    'footer.tagline': 'End-to-end solutions for your corporate and New Year gifts. Partnership approach delivering results.',
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
