import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import PackageModal from '@/components/PackageModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { useDebounce } from '@/hooks/useDebounce';
import type { Package } from '@shared/schema';

interface PaginatedResponse {
  data: Package[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const { language } = useLanguage();
  const pageSize = 12;
  
  // Get query from URL using wouter location
  const searchParams = useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Debounce search query to reduce API calls (300ms)
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Sync search query with URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location]);

  // Fetch packages with debounced search query
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ['/api/packages/search', debouncedQuery, pageSize],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedQuery) {
        params.set('search', debouncedQuery);
      }

      const res = await fetch(`/api/packages?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!debouncedQuery,
  });

  // Flatten all pages
  const allPackages = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.pagination.totalCount ?? 0;

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    // Escape regex special characters to prevent syntax errors
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-primary/20 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleLearnMore = (pkg: Package) => {
    setSelectedPackageId(pkg.id);
    setModalOpen(true);
  };

  const handleInquire = () => {
    setModalOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold">
              {language === 'me' ? 'Pretraga Paketa' : 'Search Packages'}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === 'me' ? 'Unesite naziv paketa...' : 'Enter package name...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg"
                  data-testid="input-search-page"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    data-testid="button-clear-search-page"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <button type="submit" className="sr-only">Search</button>
            </form>

            {/* Results Count */}
            {searchQuery && !isLoading && (
              <p className="text-sm text-muted-foreground" data-testid="text-search-results-count">
                {language === 'me' 
                  ? `Pronađeno ${totalCount} ${totalCount === 1 ? 'paket' : 'paketa'} za "${searchQuery}"`
                  : `Found ${totalCount} ${totalCount === 1 ? 'package' : 'packages'} for "${searchQuery}"`
                }
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !searchQuery ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-lg text-muted-foreground">
                {language === 'me' 
                  ? 'Unesite naziv paketa za pretragu' 
                  : 'Enter a package name to search'
                }
              </p>
            </div>
          ) : allPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-search-results">
                {allPackages.map((pkg) => (
                  <div key={pkg.id}>
                    <PackageCard
                      id={pkg.id}
                      name={language === 'me' ? pkg.nameME : pkg.nameEN}
                      price={pkg.price}
                      minOrder={pkg.minOrder}
                      image={pkg.image}
                      items={[]}
                      category={pkg.category}
                      packageData={pkg}
                      onLearnMore={() => handleLearnMore(pkg)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                    data-testid="button-load-more-search"
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {language === 'me' ? 'Učitaj još' : 'Load More'}
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="text-center mt-8 text-sm text-muted-foreground">
                {language === 'me' 
                  ? `Prikazuje se ${allPackages.length} od ${totalCount} paketa`
                  : `Showing ${allPackages.length} of ${totalCount} packages`
                }
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground" data-testid="text-no-search-results">
                {language === 'me' 
                  ? `Nema rezultata za "${searchQuery}"`
                  : `No results for "${searchQuery}"`
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Package Modal */}
      <PackageModal
        package={allPackages.find(p => p.id === selectedPackageId) || null}
        products={[]}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInquire={handleInquire}
      />
    </div>
  );
}
