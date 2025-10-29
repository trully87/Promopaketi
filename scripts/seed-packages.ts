import { db } from '../server/storage';
import { packages as packagesTable, packageProducts } from '../shared/schema';

const EUR_TO_RSD = 117; // Conversion rate

// Package data with image paths from attached_assets
const packagesData = [
  {
    name: { me: 'Osnovni Novogodišnji Paket', en: "Basic New Year's Package" },
    price: 40,
    minOrder: 30,
    category: 'newyear' as const,
    image: '/attached_assets/generated_images/Basic_New_Year_package_69461e16.png',
    products: [
      {
        name: { me: 'Keramička Šolja', en: 'Ceramic Mug' },
        description: { 
          me: 'Visokokvalitetna keramička šolja sa mogućnošću personalizacije putem štampe logotipa ili inicijala.',
          en: 'High-quality ceramic mug with customization option through logo or initial printing.'
        },
        specs: { me: 'Zapremina: 300 ml | Dostupno u 5 boja', en: 'Capacity: 300 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Organsko Domaće Med', en: 'Organic Local Honey' },
        description: { 
          me: '100% organski med od domaćih crnogorskih proizvođača. Personalizacija putem štampe na naljepnici.',
          en: '100% organic honey from local Montenegrin producers. Customization through label printing.'
        },
        specs: { me: 'Težina: 250 ml | Dimenzija naljepnice: 5.6 cm x 10.5 cm', en: 'Weight: 250 ml | Label size: 5.6 cm x 10.5 cm' }
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski domaći čaj od crnogorskih proizvođača u platnenoj kesici sa mogućnošću personalizacije.',
          en: 'Organic local tea from Montenegrin producers in a linen bag with customization option.'
        },
        specs: { me: 'Težina: 50 g | Dostupno u jednoj boji', en: 'Weight: 50 g | Available in one color' }
      },
      {
        name: { me: 'Drvena Kašičica', en: 'Wooden Spoon' },
        description: { 
          me: 'Ručno izrađena drvena kašičica sa mogućnošću personalizacije putem štampe.',
          en: 'Handcrafted wooden spoon with customization option through printing.'
        },
        specs: { me: 'Materijal: Prirodno drvo', en: 'Material: Natural wood' }
      },
      {
        name: { me: 'Novogodišnja Čestitka', en: "New Year's Greeting Card" },
        description: { 
          me: 'Personalizovani dizajn novogodišnje čestitke u duhu vrijednosti i estetike Vaše firme.',
          en: "Personalized New Year's greeting card design reflecting your company's values and aesthetics."
        },
        specs: { me: 'Dimenzija: 10 cm x 10 cm', en: 'Dimensions: 10 cm x 10 cm' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Luksuzno pakovanje sa mogućnošću štampe ili otiska logotipa. Kutija i banderola dostupne u raznim bojama.',
          en: 'Luxury packaging with logo printing or embossing option. Box and band available in various colors.'
        },
        specs: { me: 'Dostupno u 11 boja', en: 'Available in 11 colors' }
      }
    ]
  },
  {
    name: { me: 'Standardni Novogodišnji Paket', en: "Standard New Year's Package" },
    price: 46,
    minOrder: 30,
    category: 'newyear' as const,
    image: '/attached_assets/generated_images/Standard_New_Year_package_413cce95.png',
    products: [
      {
        name: { me: 'Ćebe od Flisa', en: 'Fleece Blanket' },
        description: { 
          me: 'Mekano flis ćebe koje pruža savršenu dozu udobnosti i topline u hladnim danima.',
          en: 'Soft fleece blanket providing perfect comfort and warmth on cold days.'
        },
        specs: { me: 'Dimenzije: 95 cm x 145 cm | 180 g/m² | Dostupno u 5 boja', en: 'Dimensions: 95 cm x 145 cm | 180 g/m² | Available in 5 colors' }
      },
      {
        name: { me: 'Keramička Šolja', en: 'Ceramic Mug' },
        description: { 
          me: 'Visokokvalitetna keramička šolja sa mogućnošću personalizacije putem štampe logotipa.',
          en: 'High-quality ceramic mug with logo printing customization option.'
        },
        specs: { me: 'Zapremina: 300 ml | Dostupno u 5 boja', en: 'Capacity: 300 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski domaći čaj sa personalizacijom i naglaskom na 100% crnogorsku proizvodnju.',
          en: 'Organic local tea with customization emphasizing 100% Montenegrin production.'
        },
        specs: { me: 'Težina: 50 g | Dostupno u jednoj boji', en: 'Weight: 50 g | Available in one color' }
      },
      {
        name: { me: 'Čokolada Montenegrina', en: 'Montenegrina Chocolate' },
        description: { 
          me: 'Domaća čokolada bogatog ukusa, proizvedena s pažnjom i ponosom u Crnoj Gori.',
          en: 'Local chocolate with rich flavor, produced with care and pride in Montenegro.'
        },
        specs: { me: 'Težina: 80 g', en: 'Weight: 80 g' }
      },
      {
        name: { me: 'Novogodišnja Svijeća', en: "New Year's Candle" },
        description: { 
          me: 'Dekorativna svijeća ručnog rada sa pažnjom posvećenom detaljima. Unosi notu praznične atmosfere.',
          en: 'Handcrafted decorative candle with attention to detail. Adds a festive atmosphere.'
        },
        specs: { me: 'Dimenzije: 5.5 cm x 5.5 cm', en: 'Dimensions: 5.5 cm x 5.5 cm' }
      },
      {
        name: { me: 'Novogodišnja Čestitka', en: "New Year's Greeting Card" },
        description: { 
          me: 'Personalizovani dizajn u duhu vrijednosti i estetike Vaše firme.',
          en: "Personalized design reflecting your company's values and aesthetics."
        },
        specs: { me: 'Dimenzija: 10 cm x 15 cm', en: 'Dimensions: 10 cm x 15 cm' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Kutija sa magnetnim poklopcem i mogućnošću personalizacije.',
          en: 'Box with magnetic lid and customization option.'
        },
        specs: { me: 'Dostupno u 11 boja', en: 'Available in 11 colors' }
      }
    ]
  },
  {
    name: { me: 'Premium Paket sa Termosom', en: 'Premium Package with Thermos' },
    price: 50,
    minOrder: 30,
    category: 'newyear' as const,
    image: '/attached_assets/generated_images/Premium_thermos_package_a58f5ba6.png',
    products: [
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Visokokvalitetni termos sa dvostrukom personalizacijom - na poklopcu i na boci.',
          en: 'High-quality thermos with double customization - on lid and bottle.'
        },
        specs: { me: 'Zapremina: 570 ml | Dostupno u 5 boja', en: 'Capacity: 570 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Pljoska', en: 'Hip Flask' },
        description: { 
          me: 'Elegantna pljoska sa mogućnošću personalizacije putem štampe.',
          en: 'Elegant hip flask with printing customization option.'
        },
        specs: { me: 'Zapremina: 115 ml | Dostupno u 2 boje', en: 'Capacity: 115 ml | Available in 2 colors' }
      },
      {
        name: { me: 'Organsko Domaće Med', en: 'Organic Local Honey' },
        description: { 
          me: '100% organski med od domaćih crnogorskih proizvođača.',
          en: '100% organic honey from local Montenegrin producers.'
        },
        specs: { me: 'Težina: 250 ml | Dimenzija naljepnice: 5.6 cm x 10.5 cm', en: 'Weight: 250 ml | Label size: 5.6 cm x 10.5 cm' }
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski čaj sa personalizacijom i naglaskom na crnogorsku proizvodnju.',
          en: 'Organic tea with customization emphasizing Montenegrin production.'
        },
        specs: { me: 'Težina: 50 g', en: 'Weight: 50 g' }
      },
      {
        name: { me: 'Drvena Kašičica', en: 'Wooden Spoon' },
        description: { 
          me: 'Ručno izrađena drvena kašičica sa personalizacijom.',
          en: 'Handcrafted wooden spoon with customization.'
        },
        specs: { me: 'Materijal: Prirodno drvo', en: 'Material: Natural wood' }
      },
      {
        name: { me: 'Novogodišnja Čestitka', en: "New Year's Greeting Card" },
        description: { 
          me: 'Personalizovani dizajn čestitke.',
          en: 'Personalized greeting card design.'
        },
        specs: { me: 'Dimenzija: 10 cm x 15 cm', en: 'Dimensions: 10 cm x 15 cm' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Luksuzno pakovanje sa vrpcom i personalizacijom.',
          en: 'Luxury packaging with ribbon and customization.'
        },
        specs: { me: 'Kutija i vrpca dostupne u 11 boja', en: 'Box and ribbon available in 11 colors' }
      }
    ]
  },
  {
    name: { me: 'Premium Paket sa Maslinovim Uljem', en: 'Premium Package with Olive Oil' },
    price: 41,
    minOrder: 30,
    category: 'newyear' as const,
    image: '/attached_assets/generated_images/Premium_olive_oil_package_f3f06b68.png',
    products: [
      {
        name: { me: 'Premium Maslinovo Ulje', en: 'Premium Olive Oil' },
        description: { 
          me: 'Ekstra devičansko crnogorsko maslinovo ulje #1 sa personalizovanom etiketom.',
          en: 'Extra virgin Montenegrin olive oil #1 with personalized label.'
        },
        specs: { me: 'Zapremina: 250 ml | Ekstra devičansko', en: 'Volume: 250 ml | Extra virgin' }
      },
      {
        name: { me: 'Privjezak', en: 'Keychain' },
        description: { 
          me: 'Elegantni privjezak sa mogućnošću personalizacije.',
          en: 'Elegant keychain with customization option.'
        },
        specs: { me: 'Metalni dizajn', en: 'Metal design' }
      },
      {
        name: { me: 'Vakumirane Masline', en: 'Vacuum Packed Olives' },
        description: { 
          me: 'Crnogorske masline u vakuum pakovanju za maksimalnu svježinu.',
          en: 'Montenegrin olives in vacuum packaging for maximum freshness.'
        },
        specs: { me: 'Težina: 100 g', en: 'Weight: 100 g' }
      },
      {
        name: { me: 'Orašasto Voće', en: 'Organic Nuts' },
        description: { 
          me: 'Platnena kesica organskog orašastog voća sa personalizacijom.',
          en: 'Linen bag with organic nuts with customization.'
        },
        specs: { me: 'Težina: 100 g | 100% organsko', en: 'Weight: 100 g | 100% organic' }
      },
      {
        name: { me: 'Novogodišnja Čestitka', en: "New Year's Greeting Card" },
        description: { 
          me: 'Personalizovani dizajn čestitke.',
          en: 'Personalized greeting card design.'
        },
        specs: { me: 'Dimenzija: 10 cm x 10 cm', en: 'Dimensions: 10 cm x 10 cm' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Premium kutija sa personalizacijom.',
          en: 'Premium box with customization.'
        },
        specs: { me: 'Dostupno u više boja', en: 'Available in multiple colors' }
      }
    ]
  },
  {
    name: { me: 'Osnovni Korporativni Paket sa Kesom', en: 'Basic Corporate Package with Bag' },
    price: 20,
    minOrder: 30,
    category: 'corporate' as const,
    image: '/attached_assets/generated_images/Basic_corporate_package_bag_71ed2de4.png',
    products: [
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Kvalitetni notes sa držačem za olovku i unutrašnjim džepom. Štampa logotipa.',
          en: 'Quality notebook with pen holder and inner pocket. Logo printing.'
        },
        specs: { me: 'Format: A5 | Dostupno u 7 boja', en: 'Format: A5 | Available in 7 colors' }
      },
      {
        name: { me: 'Metalna Hemijska Olovka', en: 'Metal Pen' },
        description: { 
          me: 'Elegantna metalna olovka sa gumiranom površinom i personalizacijom.',
          en: 'Elegant metal pen with rubberized surface and customization.'
        },
        specs: { me: 'Dostupno u 16 boja', en: 'Available in 16 colors' }
      },
      {
        name: { me: 'Boca za Vodu', en: 'Water Bottle' },
        description: { 
          me: 'Sportska boca za vodu sa štampom logotipa.',
          en: 'Sports water bottle with logo printing.'
        },
        specs: { me: 'Zapremina: 650 ml | Dostupno u 5 boja', en: 'Capacity: 650 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Metalni Privezak', en: 'Metal Keychain' },
        description: { 
          me: 'Metalni privezak sa mogućnošću personalizacije.',
          en: 'Metal keychain with customization option.'
        },
        specs: { me: 'Dostupno u 5 boja', en: 'Available in 5 colors' }
      },
      {
        name: { me: 'Kesa - Pakovanje', en: 'Bag Packaging' },
        description: { 
          me: 'Brendirana kesa sa štampom logotipa.',
          en: 'Branded bag with logo printing.'
        },
        specs: { me: 'Dostupno u 11 boja', en: 'Available in 11 colors' }
      }
    ]
  },
  {
    name: { me: 'Osnovni Korporativni Paket sa Kutijom', en: 'Basic Corporate Package with Box' },
    price: 32,
    minOrder: 30,
    category: 'corporate' as const,
    image: '/attached_assets/generated_images/Corporate_package_with_box_2c8d7f38.png',
    products: [
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Notes sa fleksibilnom koricom, zaobljenim ivicama i elastičnom gumicom.',
          en: 'Notebook with flexible cover, rounded edges and elastic band.'
        },
        specs: { me: 'Format: A5 | Dostupno u 5 boja', en: 'Format: A5 | Available in 5 colors' }
      },
      {
        name: { me: 'Metalna Hemijska Olovka', en: 'Metal Pen' },
        description: { 
          me: 'Premium metalna olovka sa gumiranom površinom.',
          en: 'Premium metal pen with rubberized surface.'
        },
        specs: { me: 'Dostupno u 9 boja', en: 'Available in 9 colors' }
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Visokokvalitetni termos sa štampom logotipa.',
          en: 'High-quality thermos with logo printing.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 5 boja', en: 'Capacity: 500 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Metalni Privezak', en: 'Metal Keychain' },
        description: { 
          me: 'Metalni privezak u sivoj boji sa personalizacijom.',
          en: 'Metal keychain in grey color with customization.'
        },
        specs: { me: 'Boja: Siva', en: 'Color: Grey' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Premium kutija sa vrpcom i personalizacijom.',
          en: 'Premium box with ribbon and customization.'
        },
        specs: { me: 'Dostupno u više boja', en: 'Available in multiple colors' }
      }
    ]
  },
  {
    name: { me: 'Active Life', en: 'Active Life' },
    price: 50,
    minOrder: 30,
    category: 'corporate' as const,
    image: '/attached_assets/generated_images/Active_life_corporate_package_913e5fa0.png',
    products: [
      {
        name: { me: 'Powerbank 5000mAh', en: 'Powerbank 5000mAh' },
        description: { 
          me: 'Kompaktni powerbank sa štampom logotipa za punjenje uređaja u pokretu.',
          en: 'Compact powerbank with logo printing for charging devices on the go.'
        },
        specs: { me: 'Kapacitet: 5000mAh | Dostupno u 3 boje', en: 'Capacity: 5000mAh | Available in 3 colors' }
      },
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Notes sa fleksibilnom koricom i elastičnom gumicom.',
          en: 'Notebook with flexible cover and elastic band.'
        },
        specs: { me: 'Format: A5 | Dostupno u 5 boja', en: 'Format: A5 | Available in 5 colors' }
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Termos sa personalizacijom za aktivan životni stil.',
          en: 'Thermos with customization for active lifestyle.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 3 boje', en: 'Capacity: 500 ml | Available in 3 colors' }
      },
      {
        name: { me: 'Metalni Privezak', en: 'Metal Keychain' },
        description: { 
          me: 'Elegantni metalni privezak.',
          en: 'Elegant metal keychain.'
        },
        specs: { me: 'Boja: Siva', en: 'Color: Grey' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Premium kutija sa personalizacijom.',
          en: 'Premium box with customization.'
        },
        specs: { me: 'Dostupno u više boja', en: 'Available in multiple colors' }
      }
    ]
  },
  {
    name: { me: 'Smart Living', en: 'Smart Living' },
    price: 70,
    minOrder: 30,
    category: 'corporate' as const,
    image: '/attached_assets/generated_images/Smart_living_tech_package_65d3a7a1.png',
    products: [
      {
        name: { me: '3-in-1 Wireless Charger', en: '3-in-1 Wireless Charger' },
        description: { 
          me: 'Prenosni bežični punjač za istovremeno punjenje 3 uređaja (telefon, slušalice, sat).',
          en: 'Portable wireless charger for simultaneous charging of 3 devices (phone, earbuds, watch).'
        },
        specs: { me: 'Dostupno u 2 boje | Štampa logotipa', en: 'Available in 2 colors | Logo printing' }
      },
      {
        name: { me: 'Prenosivi 3W Zvučnik', en: 'Portable 3W Speaker' },
        description: { 
          me: 'Zvučnik od recikliranog ABS materijala sa LED trakom. BT 5.0, autonomija do 4 sata.',
          en: 'Speaker made from recycled ABS material with LED strip. BT 5.0, up to 4 hours autonomy.'
        },
        specs: { me: 'Snaga: 3W | Dostupno u 2 boje', en: 'Power: 3W | Available in 2 colors' }
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Premium termos sa personalizacijom.',
          en: 'Premium thermos with customization.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 5 boja', en: 'Capacity: 500 ml | Available in 5 colors' }
      },
      {
        name: { me: 'Čestitka', en: 'Greeting Card' },
        description: { 
          me: 'Personalizovana čestitka.',
          en: 'Personalized greeting card.'
        },
        specs: { me: 'Custom dizajn', en: 'Custom design' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Luksuzna kutija sa vrpcom.',
          en: 'Luxury box with ribbon.'
        },
        specs: { me: 'Dostupno u više boja', en: 'Available in multiple colors' }
      }
    ]
  },
  {
    name: { me: 'Eko Održivi Paket', en: 'Eco Sustainable Package' },
    price: 42,
    minOrder: 30,
    category: 'corporate' as const,
    image: '/attached_assets/generated_images/Eco_sustainable_corporate_package_6612baf2.png',
    products: [
      {
        name: { me: 'A5 Notes od Šećerne Trske', en: 'A5 Sugarcane Notebook' },
        description: { 
          me: 'Eko notes izrađen od papira šećerne trske sa zaobljenim ivicama.',
          en: 'Eco notebook made from sugarcane paper with rounded edges.'
        },
        specs: { me: 'Format: A5 | Prirodan materijal', en: 'Format: A5 | Natural material' }
      },
      {
        name: { me: 'Olovka od Pluta', en: 'Cork Pen' },
        description: { 
          me: 'Eko olovka od pluta i vlakna pšenične slame sa personalizacijom.',
          en: 'Eco pen made from cork and wheat straw fiber with customization.'
        },
        specs: { me: 'Prirodni materijali', en: 'Natural materials' }
      },
      {
        name: { me: 'Termos od Bambusa', en: 'Bamboo Thermos' },
        description: { 
          me: 'Održivi termos od bambusa sa štampom logotipa.',
          en: 'Sustainable bamboo thermos with logo printing.'
        },
        specs: { me: 'Zapremina: 440 ml | Bambus', en: 'Capacity: 440 ml | Bamboo' }
      },
      {
        name: { me: 'Drveni Privezak', en: 'Wooden Keychain' },
        description: { 
          me: 'Personalizacija putem UV štampe logotipa.',
          en: 'Customization through UV logo printing.'
        },
        specs: { me: 'Materijal: Prirodno drvo', en: 'Material: Natural wood' }
      },
      {
        name: { me: 'Čestitka', en: 'Greeting Card' },
        description: { 
          me: 'Personalizovana čestitka.',
          en: 'Personalized greeting card.'
        },
        specs: { me: 'Custom dizajn', en: 'Custom design' }
      },
      {
        name: { me: 'Custom Made Kutija', en: 'Custom Made Box' },
        description: { 
          me: 'Eko kutija sa vrpcom i personalizacijom.',
          en: 'Eco box with ribbon and customization.'
        },
        specs: { me: 'Dostupno u više boja', en: 'Available in multiple colors' }
      }
    ]
  }
];

async function seedPackages() {
  console.log('🌱 Starting to seed packages...');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing packages and products...');
    await db.delete(packageProducts);
    await db.delete(packagesTable);
    
    // Insert all packages
    for (const pkg of packagesData) {
      console.log(`\n📦 Adding package: ${pkg.name.me}`);
      
      // Convert price from EUR to RSD
      const priceInRSD = Math.round(pkg.price * EUR_TO_RSD);
      
      // Create package
      const [newPackage] = await db.insert(packagesTable).values({
        nameME: pkg.name.me,
        nameEN: pkg.name.en,
        price: priceInRSD,
        minOrder: pkg.minOrder,
        category: pkg.category,
        image: pkg.image
      }).returning();
      
      console.log(`   ✅ Package created with ID: ${newPackage.id}`);
      console.log(`   💰 Price: €${pkg.price} → ${priceInRSD} RSD`);
      
      // Add products
      console.log(`   🔧 Adding ${pkg.products.length} products...`);
      for (let i = 0; i < pkg.products.length; i++) {
        const product = pkg.products[i];
        await db.insert(packageProducts).values({
          packageId: newPackage.id,
          nameME: product.name.me,
          nameEN: product.name.en,
          descriptionME: product.description.me,
          descriptionEN: product.description.en,
          specsME: product.specs?.me || null,
          specsEN: product.specs?.en || null,
          images: [],
          sortOrder: i
        });
      }
      console.log(`   ✅ ${pkg.products.length} products added`);
    }
    
    console.log('\n✨ Successfully seeded all packages!');
    console.log(`📊 Total packages: ${packagesData.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding packages:', error);
    throw error;
  }
}

seedPackages()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });
