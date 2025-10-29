import PackageCard from '../PackageCard';
import { LanguageProvider } from '@/lib/i18n';
import basicNewyear from '@assets/generated_images/Basic_New_Year_package_69461e16.png';

export default function PackageCardExample() {
  return (
    <LanguageProvider>
      <div className="p-8 max-w-sm">
        <PackageCard
          id="ny-basic"
          name="Osnovni Novogodišnji Paket"
          price={40}
          minOrder={30}
          image={basicNewyear}
          items={[
            'Keramička šolja 300 ml',
            'Teglica organskog domaćeg meda 250 ml',
            'Platnena kesica domaćeg čaja 50 g',
            'Drvena kašičica',
            'Novogodišnja čestitka'
          ]}
          category="newyear"
          onLearnMore={() => console.log('Learn more clicked')}
        />
      </div>
    </LanguageProvider>
  );
}
