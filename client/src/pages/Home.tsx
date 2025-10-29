import { useState } from 'react';
import Hero from '@/components/Hero';
import PackageCard from '@/components/PackageCard';
import PackageModal from '@/components/PackageModal';
import CategorySection from '@/components/CategorySection';
import ContactForm from '@/components/ContactForm';
import { useLanguage } from '@/lib/i18n';
import { packages } from '@/data/packages';
import type { PackageCardProps } from '@/components/PackageCard';
import type { ProductItem } from '@/data/packages';
import standardNewyear from '@assets/generated_images/Standard_New_Year_package_413cce95.png';
import corporateBox from '@assets/generated_images/Corporate_package_with_box_2c8d7f38.png';

export default function Home() {
  const { language, t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<(PackageCardProps & { products?: ProductItem[] }) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactPackage, setContactPackage] = useState<string | undefined>();

  const handleLearnMore = (pkg: typeof packages[0]) => {
    setSelectedPackage({
      id: pkg.id,
      name: pkg.name[language],
      price: pkg.price,
      minOrder: pkg.minOrder,
      image: pkg.image,
      items: pkg.items[language],
      category: pkg.category,
      products: pkg.products,
      onLearnMore: () => {}
    });
    setModalOpen(true);
  };

  const handleInquire = (pkgName?: string) => {
    setContactPackage(pkgName);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const newyearPackages = packages.filter(p => p.category === 'newyear');
  const corporatePackages = packages.filter(p => p.category === 'corporate');

  return (
    <div className="min-h-screen">
      <Hero />

      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          <CategorySection
            title={t('category.newyear')}
            description={t('category.newyear.desc')}
            image={standardNewyear}
            onViewAll={() => document.getElementById('newyear-packages')?.scrollIntoView({ behavior: 'smooth' })}
            align="left"
          />

          <div id="newyear-packages" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newyearPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name[language]}
                price={pkg.price}
                minOrder={pkg.minOrder}
                image={pkg.image}
                items={pkg.items[language]}
                category={pkg.category}
                onLearnMore={() => handleLearnMore(pkg)}
              />
            ))}
          </div>

          <CategorySection
            title={t('category.corporate')}
            description={t('category.corporate.desc')}
            image={corporateBox}
            onViewAll={() => document.getElementById('corporate-packages')?.scrollIntoView({ behavior: 'smooth' })}
            align="right"
          />

          <div id="corporate-packages" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corporatePackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name[language]}
                price={pkg.price}
                minOrder={pkg.minOrder}
                image={pkg.image}
                items={pkg.items[language]}
                category={pkg.category}
                onLearnMore={() => handleLearnMore(pkg)}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactForm selectedPackage={contactPackage} />

      <PackageModal
        package={selectedPackage}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onInquire={() => handleInquire(selectedPackage?.name)}
      />
    </div>
  );
}
