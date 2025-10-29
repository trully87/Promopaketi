import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage, type Language } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import type { MenuItem } from '@shared/schema';
import logo from '@assets/promo brain box2_1761751687022.png';

export default function Navigation() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detect scroll for premium shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load menu items from database
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Fallback menu items if database is empty
  const fallbackNavLinks = [
    { href: '/', labelME: t('nav.home'), labelEN: t('nav.home') },
    { href: '/novogodisnji', labelME: t('nav.newyear'), labelEN: t('nav.newyear') },
    { href: '/korporativni', labelME: t('nav.corporate'), labelEN: t('nav.corporate') },
    { href: '/kontakt', labelME: t('nav.contact'), labelEN: t('nav.contact') },
  ];

  // Use database menu items if available, otherwise use fallback
  const navLinks = menuItems.length > 0
    ? menuItems.map(item => ({
        href: item.path,
        label: language === 'me' ? item.labelME : item.labelEN
      }))
    : fallbackNavLinks.map(item => ({
        href: item.href,
        label: language === 'me' ? item.labelME : item.labelEN
      }));

  const toggleLanguage = () => {
    setLanguage(language === 'me' ? 'en' : 'me');
  };

  return (
    <nav className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow duration-300 border-b ${
      scrolled ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            <img 
              src={logo} 
              alt="Brain Box Logo" 
              className="h-32 w-auto py-3"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-primary relative group ${
                  location === link.href ? 'text-primary' : 'text-foreground'
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${
                  location === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex soft-glow-primary"
                data-testid="button-admin"
              >
                Admin
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              className="gap-1.5 soft-glow-primary"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold">{language.toUpperCase()}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-3 text-sm font-medium transition-all duration-200 rounded-md ${
                  location === link.href 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                data-testid="button-admin-mobile"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
