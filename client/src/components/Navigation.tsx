import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Globe, Menu, ChevronDown, Package as PackageIcon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PackageCategory } from '@shared/schema';
import logo from '@assets/promo brain box2_1761751687022.png';

export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [shouldScrollToContact, setShouldScrollToContact] = useState(false);
  
  // Detect scroll for premium shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load package categories dynamically
  const { data: categories = [] } = useQuery<PackageCategory[]>({
    queryKey: ['/api/package-categories'],
  });

  const activeCategories = categories.filter(cat => cat.isActive === 1).sort((a, b) => a.sortOrder - b.sortOrder);

  // Handle scroll to contact after navigation completes
  useEffect(() => {
    if (shouldScrollToContact && location === '/') {
      // Retry scrolling until element is found or timeout
      let attempts = 0;
      const maxAttempts = 10; // 1 second total (100ms * 10)
      
      const attemptScroll = () => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
          setShouldScrollToContact(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(attemptScroll, 100);
        } else {
          // Give up after 1 second
          setShouldScrollToContact(false);
        }
      };
      
      // Start attempting after brief delay
      setTimeout(attemptScroll, 50);
    }
  }, [location, shouldScrollToContact]);

  const handleContactClick = () => {
    if (location === '/') {
      // Already on homepage, just scroll
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to homepage first, then scroll will trigger via useEffect
      setShouldScrollToContact(true);
      setLocation('/');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'me' ? 'en' : 'me');
  };

  return (
    <nav className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow duration-300 border-b ${
      scrolled ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <img 
              src={logo} 
              alt="Brain Box Logo" 
              className="h-32 w-auto py-3"
            />
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Packages Mega Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="text-sm font-medium transition-all duration-200 hover:text-primary bg-transparent"
                    data-testid="button-packages-menu"
                  >
                    <PackageIcon className="w-4 h-4 mr-2" />
                    {language === 'me' ? 'Paketi' : 'Packages'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {activeCategories.map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link 
                              href={`/packages/${category.value}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              data-testid={`link-category-${category.value}`}
                            >
                              <div className="text-sm font-medium leading-none">
                                {language === 'me' ? category.labelME : category.labelEN}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                {language === 'me' 
                                  ? `Pregledajte ${category.labelME.toLowerCase()}`
                                  : `Browse ${category.labelEN.toLowerCase()}`
                                }
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Contact Link */}
            <button
              onClick={handleContactClick}
              className="text-sm font-medium transition-all duration-200 hover:text-primary relative group text-foreground"
              data-testid="link-contact"
            >
              {language === 'me' ? 'Kontakt' : 'Contact'}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 w-0 group-hover:w-full" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Button - Desktop Only */}
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

            {/* Language Toggle */}
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

            {/* Mobile Menu Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{language === 'me' ? 'Navigacija' : 'Navigation'}</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {/* Package Categories */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground px-3">
                      {language === 'me' ? 'Paketi' : 'Packages'}
                    </h3>
                    {activeCategories.map((category) => (
                      <Link 
                        key={category.id} 
                        href={`/packages/${category.value}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid={`link-mobile-category-${category.value}`}
                        >
                          {language === 'me' ? category.labelME : category.labelEN}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Contact Link */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleContactClick();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="link-mobile-contact"
                  >
                    {language === 'me' ? 'Kontakt' : 'Contact'}
                  </Button>

                  {/* Admin Link */}
                  <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid="button-admin-mobile"
                    >
                      Admin
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
