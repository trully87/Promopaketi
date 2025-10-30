import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { generateMetaTags, type SEOConfig } from '@/lib/seo';

interface MetaTagsProps {
  config: SEOConfig;
}

export default function MetaTags({ config }: MetaTagsProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const meta = generateMetaTags(config, language);

    // Update document title
    document.title = meta.title;

    // Helper function to set or update meta tag
    const setMetaTag = (property: string, content: string | number | undefined, isName = false) => {
      if (!content) return;
      
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', String(content));
    };

    // Basic meta tags
    setMetaTag('description', meta.description, true);
    if (meta.keywords) {
      setMetaTag('keywords', meta.keywords, true);
    }

    // Open Graph tags
    setMetaTag('og:title', meta.ogTitle);
    setMetaTag('og:description', meta.ogDescription);
    setMetaTag('og:image', meta.ogImage);
    setMetaTag('og:url', meta.ogUrl);
    setMetaTag('og:type', meta.ogType);
    setMetaTag('og:site_name', meta.ogSiteName);
    setMetaTag('og:locale', meta.ogLocale);

    // Twitter Card tags
    setMetaTag('twitter:card', meta.twitterCard);
    setMetaTag('twitter:title', meta.twitterTitle);
    setMetaTag('twitter:description', meta.twitterDescription);
    setMetaTag('twitter:image', meta.twitterImage);

    // Product specific meta tags
    if (meta.productPrice && meta.ogType === 'product') {
      setMetaTag('product:price:amount', meta.productPrice);
      setMetaTag('product:price:currency', meta.productCurrency);
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', meta.canonical);

  }, [config, language]);

  return null;
}
