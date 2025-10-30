import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Menu, Package as PackageIcon, Sparkles, Briefcase, Leaf, Gift, Cpu, Trophy, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PackageCategory } from '@shared/schema';
import logo from '@assets/brain-box-logo.png';
import GlobalSearch from '@/components/GlobalSearch';

export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [shouldScrollToContact, setShouldScrollToContact] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Detect scroll for premium shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load package categories dynamically
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<PackageCategory[]>({
    queryKey: ['/api/package-categories'],
  });

  const activeCategories = categories.filter(cat => cat.isActive === 1).sort((a, b) => a.sortOrder - b.sortOrder);

  // Icon mapping for categories
  const getCategoryIcon = (categoryValue: string) => {
    const icons: Record<string, typeof Sparkles> = {
      'newyear': Sparkles,
      'corporate': Briefcase,
      'eko': Leaf,
      'local': Gift,
      'lokalni': Gift,
      'premium': Sparkles,
      'premium-vip': Sparkles,
      'tehnologija': Cpu,
      'sport': Trophy,
    };
    return icons[categoryValue] || PackageIcon;
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPackagesDropdownOpen(false);
      }
    };

    if (packagesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [packagesDropdownOpen]);

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
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation with Custom Dropdown Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Packages Custom Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost"
                className="text-sm font-medium transition-all duration-200 hover:text-primary"
                data-testid="button-packages-menu"
                onClick={() => setPackagesDropdownOpen(!packagesDropdownOpen)}
              >
                <PackageIcon className="w-4 h-4 mr-2" />
                {language === 'me' ? 'Paketi' : 'Packages'}
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${packagesDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {packagesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[520px] p-4 bg-card/95 backdrop-blur-sm border rounded-md shadow-lg z-50"
                  style={{ animation: 'fadeIn 0.15s ease-out' }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {categoriesLoading ? (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2 rounded-md p-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))
                    ) : (
                      activeCategories.map((category) => {
                        const IconComponent = getCategoryIcon(category.value);
                        return (
                          <Link 
                            key={category.id}
                            href={`/packages/${category.value}`}
                            className="group flex flex-col gap-1.5 p-3.5 rounded-md hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                            data-testid={`link-category-${category.value}`}
                            onClick={() => setPackagesDropdownOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                              <span className="text-sm font-semibold">
                                {language === 'me' ? category.labelME : category.labelEN}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {language === 'me' 
                                ? `Pregledajte ${category.labelME.toLowerCase()}`
                                : `Browse ${category.labelEN.toLowerCase()}`
                              }
                            </p>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Global Search */}
            <GlobalSearch />

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
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:flex soft-glow-primary"
              data-testid="button-admin"
            >
              <Link href="/admin/login">Admin</Link>
            </Button>

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
                <div className="mt-8 space-y-6">
                  {/* Package Categories */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">
                      {language === 'me' ? 'Paketi' : 'Packages'}
                    </h3>
                    {categoriesLoading ? (
                      // Loading skeleton for mobile
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="px-3 py-2">
                          <Skeleton className="h-9 w-full" />
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1">
                        {activeCategories.map((category) => {
                          const IconComponent = getCategoryIcon(category.value);
                          return (
                            <Button
                              key={category.id}
                              asChild
                              variant="ghost"
                              className="w-full justify-start gap-3 h-11"
                              data-testid={`link-mobile-category-${category.value}`}
                            >
                              <Link 
                                href={`/packages/${category.value}`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <IconComponent className="w-4 h-4 text-primary" />
                                <span>{language === 'me' ? category.labelME : category.labelEN}</span>
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t mx-3" />

                  {/* Other Links */}
                  <div className="space-y-1">
                    {/* Contact Link */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11"
                      onClick={() => {
                        handleContactClick();
                        setMobileMenuOpen(false);
                      }}
                      data-testid="link-mobile-contact"
                    >
                      <Globe className="w-4 h-4 text-primary" />
                      <span>{language === 'me' ? 'Kontakt' : 'Contact'}</span>
                    </Button>

                    {/* Admin Link */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start gap-3 h-11"
                      data-testid="button-admin-mobile"
                    >
                      <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>Admin</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
