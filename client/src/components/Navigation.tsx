import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage, type Language } from '@/lib/i18n';
import { useState } from 'react';
import type { MenuItem } from '@shared/schema';
import logo from '@assets/promo brain box2_1761751687022.png';

export default function Navigation() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
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
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                data-testid="button-admin"
              >
                Admin
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              className="rounded-md"
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
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
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
