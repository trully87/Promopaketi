import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Hero from '@/components/Hero';
import PackageCard from '@/components/PackageCard';
import PackageModal from '@/components/PackageModal';
import CategorySection from '@/components/CategorySection';
import CustomPackageSection from '@/components/CustomPackageSection';
import ContactForm from '@/components/ContactForm';
import MetaTags from '@/components/MetaTags';
import StructuredData from '@/components/StructuredData';
import { useLanguage } from '@/lib/i18n';
import { defaultSEO, getOrganizationSchema } from '@/lib/seo';
import type { PackageCardProps } from '@/components/PackageCard';
import type { Package, PackageProduct } from '@shared/schema';
import standardNewyear from '@assets/generated_images/Standard_New_Year_package_413cce95.png';
import corporateBox from '@assets/generated_images/Corporate_package_with_box_2c8d7f38.png';
import ecoImage from '@assets/stock_images/eco_friendly_natural_de0eebf0.jpg';

export default function Home() {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactPackage, setContactPackage] = useState<string | undefined>();

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: featuredPackages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages/featured"],
  });

  const { data: selectedProducts = [] } = useQuery<PackageProduct[]>({
    queryKey: ["/api/packages", selectedPackageId, "products"],
    enabled: !!selectedPackageId && modalOpen,
  });

  const selectedPackage = selectedPackageId ? packages.find(p => p.id === selectedPackageId) : null;

  const handleLearnMore = (pkg: Package) => {
    setSelectedPackageId(pkg.id);
    setModalOpen(true);
  };

  const handleInquire = (pkgName?: string) => {
    setContactPackage(pkgName);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  // Show only 4 featured packages per category on homepage
  const newyearPackages = packages.filter(p => p.category === 'newyear').slice(0, 4);
  const corporatePackages = packages.filter(p => p.category === 'corporate').slice(0, 4);
  const ekoPackages = packages.filter(p => p.category === 'eko').slice(0, 4);

  return (
    <div className="min-h-screen">
      <MetaTags config={defaultSEO[language]} />
      <StructuredData data={getOrganizationSchema(language)} />
      <Hero />

      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {/* Featured Packages */}
          {featuredPackages.length > 0 && (
            <div id="featured-packages">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  {language === 'me' ? 'Izdvojeni Paketi' : 'Featured Packages'}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {language === 'me' 
                    ? 'Naša posebna selekcija luksuznih poklonpaketa'
                    : 'Our special selection of luxury gift packages'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPackages.slice(0, 8).map((pkg) => (
                  <PackageCard
                    key={pkg.id}
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
                ))}
              </div>
            </div>
          )}

          {/* New Year Packages */}
          <div id="newyear-packages">
            <CategorySection
              title={t('category.newyear')}
              description={t('category.newyear.desc')}
              image={standardNewyear}
              onViewAll={() => setLocation('/packages/newyear')}
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {newyearPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  name={language === 'me' ? pkg.nameME : pkg.nameEN}
                  price={pkg.price}
                  minOrder={pkg.minOrder}
                  image={pkg.image}
                  items={[]}
                  category={pkg.category as "newyear" | "corporate"}
                  packageData={pkg}
                  onLearnMore={() => handleLearnMore(pkg)}
                />
              ))}
            </div>
          </div>

          {/* Corporate Packages */}
          <div id="corporate-packages">
            <CategorySection
              title={t('category.corporate')}
              description={t('category.corporate.desc')}
              image={corporateBox}
              onViewAll={() => setLocation('/packages/corporate')}
              align="right"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {corporatePackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  name={language === 'me' ? pkg.nameME : pkg.nameEN}
                  price={pkg.price}
                  minOrder={pkg.minOrder}
                  image={pkg.image}
                  items={[]}
                  category={pkg.category as "newyear" | "corporate"}
                  packageData={pkg}
                  onLearnMore={() => handleLearnMore(pkg)}
                />
              ))}
            </div>
          </div>

          {/* Eco Packages */}
          <div id="eko-packages">
            <CategorySection
              title={t('category.eko')}
              description={t('category.eko.desc')}
              image={ecoImage}
              onViewAll={() => setLocation('/packages/eko')}
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {ekoPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Package Section */}
      <CustomPackageSection />

      <ContactForm selectedPackage={contactPackage} />

      <PackageModal
        package={selectedPackage || null}
        products={selectedProducts}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInquire={() => handleInquire(selectedPackage ? (language === 'me' ? selectedPackage.nameME : selectedPackage.nameEN) : undefined)}
      />
    </div>
  );
}
