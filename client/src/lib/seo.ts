export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
}

export function generateMetaTags(config: SEOConfig, language: 'me' | 'en') {
  const baseTitle = language === 'me' ? 'Brain Box' : 'Brain Box';
  const fullTitle = `${config.title} | ${baseTitle}`;
  
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://brainbox.com');
  const fullUrl = config.url ? `${siteUrl}${config.url}` : siteUrl;
  const imageUrl = config.image ? `${siteUrl}${config.image}` : `${siteUrl}/og-image.png`;

  return {
    title: fullTitle,
    description: config.description,
    keywords: config.keywords?.join(', '),
    canonical: fullUrl,
    
    // Open Graph
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage: imageUrl,
    ogUrl: fullUrl,
    ogType: config.type || 'website',
    ogSiteName: 'Brain Box',
    ogLocale: language === 'me' ? 'sr_ME' : 'en_US',
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: config.title,
    twitterDescription: config.description,
    twitterImage: imageUrl,
    
    // Product specific (if applicable)
    productPrice: config.price,
    productCurrency: config.currency || 'EUR',
  };
}

export const defaultSEO: Record<'me' | 'en', SEOConfig> = {
  me: {
    title: 'Premium Poklon Paketi sa Personalizacijom',
    description: 'Luksuzni novogodišnji i korporativni poklon paketi sa personalizacijom. Visokokvalitetni proizvodi crnogorskih i ekoloških proizvođača. Minimalna narudžba 30 komada.',
    keywords: ['poklon paketi', 'novogodišnji paketi', 'korporativni pokloni', 'personalizacija', 'premium pokloni', 'Crna Gora', 'Brain Box'],
    type: 'website'
  },
  en: {
    title: 'Premium Gift Packages with Personalization',
    description: 'Luxury New Year and corporate gift packages with personalization. High-quality products from Montenegrin and eco-friendly producers. Minimum order 30 units.',
    keywords: ['gift packages', 'new year packages', 'corporate gifts', 'personalization', 'premium gifts', 'Montenegro', 'Brain Box'],
    type: 'website'
  }
};

export function getCategorySEO(category: string, language: 'me' | 'en'): SEOConfig {
  const categoryMap: Record<string, { me: SEOConfig; en: SEOConfig }> = {
    newyear: {
      me: {
        title: 'Novogodišnji Paketi',
        description: 'Premium novogodišnji poklon paketi sa personalizacijom. Elegantni setovi sa luksuznim proizvodima za poslovne partnere i zaposlene.',
        keywords: ['novogodišnji paketi', 'nova godina pokloni', 'poklon paketi', 'personalizovani pokloni'],
        type: 'website'
      },
      en: {
        title: 'New Year Packages',
        description: 'Premium New Year gift packages with personalization. Elegant sets with luxury products for business partners and employees.',
        keywords: ['new year packages', 'new year gifts', 'gift packages', 'personalized gifts'],
        type: 'website'
      }
    },
    corporate: {
      me: {
        title: 'Korporativni Paketi',
        description: 'Profesionalni korporativni poklon paketi za poslovne partnere i zaposlene. Premium kvalitet sa mogućnošću brendiranja i personalizacije.',
        keywords: ['korporativni pokloni', 'poslovni pokloni', 'brendirani paketi', 'kompanijski pokloni'],
        type: 'website'
      },
      en: {
        title: 'Corporate Packages',
        description: 'Professional corporate gift packages for business partners and employees. Premium quality with branding and personalization options.',
        keywords: ['corporate gifts', 'business gifts', 'branded packages', 'company gifts'],
        type: 'website'
      }
    },
    eko: {
      me: {
        title: 'Eko Paketi',
        description: 'Ekološki poklon paketi sa proizvodima lokalnih proizvođača. Održivi i ekološki prihvatljivi luksuzni pokloni.',
        keywords: ['eko paketi', 'ekološki pokloni', 'lokalni proizvođači', 'održivi pokloni'],
        type: 'website'
      },
      en: {
        title: 'Eco Packages',
        description: 'Ecological gift packages with local producer products. Sustainable and eco-friendly luxury gifts.',
        keywords: ['eco packages', 'ecological gifts', 'local producers', 'sustainable gifts'],
        type: 'website'
      }
    }
  };

  return categoryMap[category]?.[language] || defaultSEO[language];
}

export function getPackageSEO(packageName: string, price: number, category: string, language: 'me' | 'en'): SEOConfig {
  const description = language === 'me' 
    ? `${packageName} - Premium poklon paket sa personalizacijom. Cena: €${price} po komadu. Minimalna narudžba 30 komada.`
    : `${packageName} - Premium gift package with personalization. Price: €${price} per unit. Minimum order 30 units.`;

  return {
    title: packageName,
    description,
    keywords: language === 'me' 
      ? ['poklon paket', packageName, 'personalizacija', 'premium poklon']
      : ['gift package', packageName, 'personalization', 'premium gift'],
    type: 'product',
    price,
    currency: 'EUR'
  };
}

// JSON-LD Structured Data
export function getOrganizationSchema(language: 'me' | 'en') {
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://brainbox.com');
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Brain Box",
    "description": language === 'me' 
      ? "Premium poklon paketi sa personalizacijom za korporativne i novogodišnje prilike"
      : "Premium gift packages with personalization for corporate and New Year occasions",
    "url": siteUrl,
    "logo": `${siteUrl}/attached_assets/generated_images/Brain_Box_Premium_Logo_a0bf7ba8.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["sr", "en"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ME"
    },
    "sameAs": []
  };
}

export function getProductSchema(
  packageId: string,
  packageName: string, 
  description: string,
  price: number,
  imageUrl: string,
  category: string,
  language: 'me' | 'en'
) {
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://brainbox.com');
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": packageName,
    "description": description,
    "image": imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
    "url": `${siteUrl}/package/${packageId}`,
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price.toString(),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Brain Box"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Brain Box"
    }
  };
}
