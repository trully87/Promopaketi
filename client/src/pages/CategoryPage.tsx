import { useParams, useLocation } from "wouter";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import PackageCard from "@/components/PackageCard";
import PackageModal from "@/components/PackageModal";
import FilterControls from "@/components/FilterControls";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, Loader2, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import type { Package, PackageProduct } from "@shared/schema";
import { useState, useMemo, useEffect } from "react";

interface PaginatedResponse {
  data: Package[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const CATEGORY_META = {
  newyear: {
    titleME: "Novogodišnji Paketi",
    titleEN: "New Year's Packages",
    descME: "Premium novogodišnji pokloni i poslovni paketi sa pažljivo odabranim proizvodima",
    descEN: "Premium New Year gifts and corporate packages with carefully selected products",
  },
  corporate: {
    titleME: "Korporativni Paketi",
    titleEN: "Corporate Packages",
    descME: "Profesionalni korporativni pokloni idealni za vaše partnere i zaposlene",
    descEN: "Professional corporate gifts ideal for your partners and employees",
  },
  eko: {
    titleME: "Eko Paketi",
    titleEN: "Eco Packages",
    descME: "Održivi i ekološki pokloni sa lokalnim proizvodima",
    descEN: "Sustainable and eco-friendly gifts with local products",
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const pageSize = 12;
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort state with URL sync
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Sync filters with URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    const search = params.get('search');
    const sortBy = params.get('sortBy');
    const sortOrder = params.get('sortOrder');

    // Parse price params with NaN protection
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (minPriceParam) {
      const parsed = parseFloat(minPriceParam);
      minPrice = isFinite(parsed) ? parsed : undefined;
    }

    if (maxPriceParam) {
      const parsed = parseFloat(maxPriceParam);
      maxPrice = isFinite(parsed) ? parsed : undefined;
    }

    setFilters({
      minPrice,
      maxPrice,
      search: search || '',
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });
  }, [category]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    // Only update URL if it changed (prevent infinite loop)
    if (window.location.search !== newUrl) {
      window.history.replaceState({}, '', `/packages/${category}${newUrl}`);
    }
  }, [filters, category]);

  const hasActiveFilters = 
    filters.minPrice !== undefined || 
    filters.maxPrice !== undefined || 
    filters.search !== '' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  const clearFilters = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Use infinite query for proper Load More functionality
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: [`/api/packages`, category, pageSize, filters],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      const params = new URLSearchParams({
        category: category!,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/packages?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!category,
  });

  // Flatten all pages into single array
  const allPackages = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination?.total ?? 0;

  const { data: selectedProducts = [] } = useQuery<PackageProduct[]>({
    queryKey: ["/api/packages", selectedPackageId, "products"],
    enabled: !!selectedPackageId && modalOpen,
  });

  const selectedPackage = selectedPackageId 
    ? allPackages.find(p => p.id === selectedPackageId) || null
    : null;

  const handleLearnMore = (pkg: Package) => {
    setSelectedPackageId(pkg.id);
    setModalOpen(true);
  };

  const handleInquire = () => {
    setModalOpen(false);
    setLocation('/');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!category || !(category in CATEGORY_META)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {language === 'me' ? 'Kategorija nije pronađena' : 'Category not found'}
          </h1>
          <Link href="/">
            <Button variant="default">
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'me' ? 'Nazad na početnu' : 'Back to home'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  const title = language === 'me' ? meta.titleME : meta.titleEN;
  const description = language === 'me' ? meta.descME : meta.descEN;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            {language === 'me' ? 'Greška pri učitavanju' : 'Error loading packages'}
          </h1>
          <Link href="/">
            <Button variant="default">
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'me' ? 'Nazad na početnu' : 'Back to home'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-cream py-16 px-4 border-b border-border/40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-home">
              {language === 'me' ? 'Početna' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{title}</span>
          </div>

          {/* Title and Description */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4" data-testid="text-category-title">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl" data-testid="text-category-description">
            {description}
          </p>

          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-package-count">
              {language === 'me' 
                ? `${totalCount} ${totalCount === 1 ? 'paket' : 'paketa'}`
                : `${totalCount} ${totalCount === 1 ? 'package' : 'packages'}`
              }
            </p>
          )}
        </div>
      </section>

      {/* Packages Grid with Filters */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full" data-testid="button-mobile-filters">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {language === 'me' ? 'Filteri i Sortiranje' : 'Filters & Sorting'}
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {language === 'me' ? 'Aktivni' : 'Active'}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {language === 'me' ? 'Filteri i Sortiranje' : 'Filters & Sorting'}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterControls
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    search={filters.search}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onMinPriceChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
                    onMaxPriceChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                    onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                    onSortChange={(sortBy, sortOrder) => setFilters(prev => ({ ...prev, sortBy, sortOrder }))}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Layout: Sidebar + Content */}
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterControls
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  search={filters.search}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onMinPriceChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
                  onMaxPriceChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                  onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                  onSortChange={(sortBy, sortOrder) => setFilters(prev => ({ ...prev, sortBy, sortOrder }))}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </aside>

            {/* Packages Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : allPackages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8" data-testid="grid-packages">
                {allPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    id={pkg.id}
                    name={language === 'me' ? pkg.nameME : pkg.nameEN}
                    price={pkg.price}
                    minOrder={pkg.minOrder}
                    image={pkg.image}
                    items={[]}
                    category={pkg.category}
                    onLearnMore={() => handleLearnMore(pkg)}
                  />
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
                    data-testid="button-load-more"
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {language === 'me' ? 'Učitaj još' : 'Load More'}
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="text-center mt-8 text-sm text-muted-foreground" data-testid="text-pagination-info">
                {language === 'me' 
                  ? `Prikazuje se ${allPackages.length} od ${totalCount} paketa`
                  : `Showing ${allPackages.length} of ${totalCount} packages`
                }
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground" data-testid="text-no-packages">
                {language === 'me' ? 'Nema paketa u ovoj kategoriji.' : 'No packages in this category.'}
              </p>
            </div>
          )}
            </div>
          </div>
        </div>
      </section>

      {/* Package Modal */}
      <PackageModal
        package={selectedPackage}
        products={selectedProducts}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInquire={handleInquire}
      />
    </div>
  );
}
