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
    'nav.about': 'O Nama',
    'nav.packages': 'Paketi',
    'nav.newyear': 'Novogodišnji paketi',
    'nav.corporate': 'Korporativni paketi',
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
    
    // About Us Page
    'about.hero.title': 'O Brain Box-u',
    'about.hero.subtitle': 'Vaš pouzdani partner za end-to-end rješenja poslovnih poklona',
    'about.story.title': 'Naša Priča',
    'about.story.content': 'Brain Box je osnovan sa vizijom da transformiše način na koji kompanije prisupaju poslovnim poklonima. Razumijemo da svaki poklon predstavlja priliku da ojačate poslovne odnose i izgradite trajne veze sa klijentima, partnerima i zaposlenima.\n\nNaš pristup zasniva se na dubinskom razumijevanju Vaših potreba, kreativnom dizajnu koji ostavlja utisak, i besprijekornoj realizaciji koja osigurava uspjeh. Sa godinama iskustva u industriji, izgradili smo reputaciju pouzdanog partnera koji donosi rezultate.',
    'about.values.title': 'Naše Vrijednosti',
    'about.value.quality.title': 'Kvalitet',
    'about.value.quality.desc': 'Najbolji materijali i vrhunska izrada za svaki projekat',
    'about.value.innovation.title': 'Inovacija',
    'about.value.innovation.desc': 'Kreativna rješenja koja prate trendove i nadilaze očekivanja',
    'about.value.partnership.title': 'Partnerstvo',
    'about.value.partnership.desc': 'Dugoročne veze zasnovane na povjerenju i zajedničkom uspjehu',
    'about.value.excellence.title': 'Izvrsnost',
    'about.value.excellence.desc': 'Posvećenost savršenstvu u svakom aspektu našeg rada',
    'about.stats.clients': 'Zadovoljnih Klijenata',
    'about.stats.packages': 'Isporučenih Paketa',
    'about.stats.experience': 'Godine Iskustva',
    'about.stats.satisfaction': 'Stopa Zadovoljstva',
    'about.cta.title': 'Spremni da Započnemo?',
    'about.cta.desc': 'Kontaktirajte nas danas i otkrijte kako možemo transformisati Vaš program poslovnih poklona',
    'about.cta.button': 'Razgovarajmo',
    
    // How We Work Section
    'howwework.title': 'Kako Radimo',
    'howwework.subtitle': 'Naš pristup kombinuje strategiju, dizajn i besprijekornu realizaciju',
    'howwework.understanding.title': 'Razumijevanje',
    'howwework.understanding.desc': 'Pažljivo slušamo Vaše zahtjeve kako bismo precizno razumjeli Vaše potrebe. Naša duboka poznavanje poslovnih procesa osigurava potpuno razumijevanje.',
    'howwework.design.title': 'Dizajn',
    'howwework.design.desc': 'Pružamo prilagođena dizajnerska rješenja koja savršeno odgovaraju Vašim poslovnim potrebama. Kreativan tim kreira inovativna rješenja koja ostavljaju utisak.',
    'howwework.production.title': 'Proizvodnja',
    'howwework.production.desc': 'Vlastite proizvodne kapacitete omogućavaju nam isporuku marketing materijala vrhunskog kvaliteta po konkurentnim cijenama sa brzim rokovima.',
    'howwework.delivery.title': 'Isporuka',
    'howwework.delivery.desc': 'Pouzdana nabavka, pakovanje i isporuka Vaših jedinstvenih poklona. Djelujemo kao Vaši predstavnici, pružajući vrhunski kvalitet po najpovoljnijim cijenama.',
    
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
    'nav.about': 'About Us',
    'nav.packages': 'Packages',
    'nav.newyear': "New Year's Packages",
    'nav.corporate': 'Corporate Packages',
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
    
    // About Us Page
    'about.hero.title': 'About Brain Box',
    'about.hero.subtitle': 'Your trusted partner for end-to-end business gift solutions',
    'about.story.title': 'Our Story',
    'about.story.content': 'Brain Box was founded with a vision to transform how companies approach corporate gifting. We understand that every gift represents an opportunity to strengthen business relationships and build lasting connections with clients, partners, and employees.\n\nOur approach is built on deep understanding of your needs, creative design that leaves an impression, and flawless execution that ensures success. With years of industry experience, we\'ve built a reputation as a trusted partner that delivers results.',
    'about.values.title': 'Our Values',
    'about.value.quality.title': 'Quality',
    'about.value.quality.desc': 'Premium materials and superior craftsmanship for every project',
    'about.value.innovation.title': 'Innovation',
    'about.value.innovation.desc': 'Creative solutions that follow trends and exceed expectations',
    'about.value.partnership.title': 'Partnership',
    'about.value.partnership.desc': 'Long-term relationships built on trust and mutual success',
    'about.value.excellence.title': 'Excellence',
    'about.value.excellence.desc': 'Commitment to perfection in every aspect of our work',
    'about.stats.clients': 'Satisfied Clients',
    'about.stats.packages': 'Packages Delivered',
    'about.stats.experience': 'Years of Experience',
    'about.stats.satisfaction': 'Satisfaction Rate',
    'about.cta.title': 'Ready to Get Started?',
    'about.cta.desc': 'Contact us today and discover how we can transform your corporate gifting program',
    'about.cta.button': 'Let\'s Talk',
    
    // How We Work Section
    'howwework.title': 'How We Work',
    'howwework.subtitle': 'Our approach combines strategy, design and flawless execution',
    'howwework.understanding.title': 'Understanding',
    'howwework.understanding.desc': 'We attentively listen to your requirements to precisely understand your needs. Our deep knowledge of business processes ensures comprehensive understanding.',
    'howwework.design.title': 'Design',
    'howwework.design.desc': 'We provide tailored design solutions perfectly aligned with your business needs. Our creative team crafts innovative solutions that leave lasting impressions.',
    'howwework.production.title': 'Production',
    'howwework.production.desc': 'Our own production capacity enables delivery of top-quality marketing materials at competitive prices with swift turnarounds.',
    'howwework.delivery.title': 'Delivery',
    'howwework.delivery.desc': 'Reliable procurement, packaging and delivery of your unique gifts. We act as your representatives, providing premium quality at the most competitive rates.',
    
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
