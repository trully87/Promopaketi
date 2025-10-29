import basicNewyear from '@assets/generated_images/Basic_New_Year_package_69461e16.png';
import standardNewyear from '@assets/generated_images/Standard_New_Year_package_413cce95.png';
import premiumThermos from '@assets/generated_images/Premium_thermos_package_a58f5ba6.png';
import premiumOlive from '@assets/generated_images/Premium_olive_oil_package_f3f06b68.png';
import basicCorporateBag from '@assets/generated_images/Basic_corporate_package_bag_71ed2de4.png';
import corporateBox from '@assets/generated_images/Corporate_package_with_box_2c8d7f38.png';
import activeLife from '@assets/generated_images/Active_life_corporate_package_913e5fa0.png';
import smartLiving from '@assets/generated_images/Smart_living_tech_package_65d3a7a1.png';
import ecoFriendly from '@assets/generated_images/Eco_sustainable_corporate_package_6612baf2.png';

// Product images
import ceramicMug from '@assets/generated_images/Ceramic_mug_product_shot_17d03128.png';
import thermoBottle from '@assets/generated_images/Thermos_bottle_product_54b5c10d.png';
import honeyJar from '@assets/generated_images/Organic_honey_jar_2e2f94af.png';
import teaBag from '@assets/generated_images/Linen_tea_bag_b8e1ff0e.png';
import fleeceBlanket from '@assets/generated_images/Fleece_blanket_product_de9569d0.png';
import notebook from '@assets/generated_images/A5_notebook_product_5158505c.png';
import metalPen from '@assets/generated_images/Metal_pen_product_338ae787.png';
import powerbank from '@assets/generated_images/Powerbank_5000mAh_94fdd631.png';
import wirelessCharger from '@assets/generated_images/Wireless_charger_3-in-1_136478c9.png';
import bambooThermos from '@assets/generated_images/Bamboo_thermos_eco_e0dd08e1.png';
import oliveOil from '@assets/generated_images/Olive_oil_bottle_7f47628c.png';
import bluetoothSpeaker from '@assets/generated_images/Bluetooth_speaker_3W_dade6bac.png';

export interface ProductItem {
  name: { me: string; en: string };
  description: { me: string; en: string };
  specs?: { me: string; en: string };
  images?: string[]; // Up to 3 images per product
}

export interface Package {
  id: string;
  name: { me: string; en: string };
  price: number;
  minOrder: number;
  category: 'newyear' | 'corporate';
  image: string;
  items: { me: string[]; en: string[] };
  products: ProductItem[];
}

export const packages: Package[] = [
  {
    id: 'ny-basic',
    name: {
      me: 'Osnovni Novogodišnji Paket',
      en: "Basic New Year's Package"
    },
    price: 40,
    minOrder: 30,
    category: 'newyear',
    image: basicNewyear,
    items: {
      me: [
        'Keramička šolja 300 ml',
        'Teglica organskog domaćeg meda 250 ml',
        'Platnena kesica domaćeg čaja 50 g',
        'Drvena kašičica',
        'Novogodišnja čestitka',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'Ceramic mug 300 ml',
        'Organic local honey jar 250 ml',
        'Linen tea bag 50 g',
        'Wooden spoon',
        "New Year's greeting card",
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'Keramička Šolja', en: 'Ceramic Mug' },
        description: { 
          me: 'Visokokvalitetna keramička šolja sa mogućnošću personalizacije putem štampe logotipa ili inicijala.',
          en: 'High-quality ceramic mug with customization option through logo or initial printing.'
        },
        specs: { me: 'Zapremina: 300 ml | Dostupno u 5 boja', en: 'Capacity: 300 ml | Available in 5 colors' },
        images: [ceramicMug]
      },
      {
        name: { me: 'Organsko Domaće Med', en: 'Organic Local Honey' },
        description: { 
          me: '100% organski med od domaćih crnogorskih proizvođača. Personalizacija putem štampe na naljepnici.',
          en: '100% organic honey from local Montenegrin producers. Customization through label printing.'
        },
        specs: { me: 'Težina: 250 ml | Dimenzija naljepnice: 5.6 cm x 10.5 cm', en: 'Weight: 250 ml | Label size: 5.6 cm x 10.5 cm' },
        images: [honeyJar]
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski domaći čaj od crnogorskih proizvođača u platnenoj kesici sa mogućnošću personalizacije.',
          en: 'Organic local tea from Montenegrin producers in a linen bag with customization option.'
        },
        specs: { me: 'Težina: 50 g | Dostupno u jednoj boji', en: 'Weight: 50 g | Available in one color' },
        images: [teaBag]
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
    id: 'ny-standard',
    name: {
      me: 'Standardni Novogodišnji Paket',
      en: "Standard New Year's Package"
    },
    price: 46,
    minOrder: 30,
    category: 'newyear',
    image: standardNewyear,
    items: {
      me: [
        'Ćebe od flisa',
        'Keramička šolja 300 ml',
        'Platnena kesica domaćeg čaja 50 g',
        'Čokolada 80 g',
        'Novogodišnja čestitka',
        'Novogodišnja svijeća',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'Fleece blanket',
        'Ceramic mug 300 ml',
        'Linen tea bag 50 g',
        'Chocolate 80 g',
        "New Year's greeting card",
        "New Year's candle",
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'Ćebe od Flisa', en: 'Fleece Blanket' },
        description: { 
          me: 'Mekano flis ćebe koje pruža savršenu dozu udobnosti i topline u hladnim danima.',
          en: 'Soft fleece blanket providing perfect comfort and warmth on cold days.'
        },
        specs: { me: 'Dimenzije: 95 cm x 145 cm | 180 g/m² | Dostupno u 5 boja', en: 'Dimensions: 95 cm x 145 cm | 180 g/m² | Available in 5 colors' },
        images: [fleeceBlanket]
      },
      {
        name: { me: 'Keramička Šolja', en: 'Ceramic Mug' },
        description: { 
          me: 'Visokokvalitetna keramička šolja sa mogućnošću personalizacije putem štampe logotipa.',
          en: 'High-quality ceramic mug with logo printing customization option.'
        },
        specs: { me: 'Zapremina: 300 ml | Dostupno u 5 boja', en: 'Capacity: 300 ml | Available in 5 colors' },
        images: [ceramicMug]
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski domaći čaj sa personalizacijom i naglaskom na 100% crnogorsku proizvodnju.',
          en: 'Organic local tea with customization emphasizing 100% Montenegrin production.'
        },
        specs: { me: 'Težina: 50 g | Dostupno u jednoj boji', en: 'Weight: 50 g | Available in one color' },
        images: [teaBag]
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
    id: 'ny-thermos',
    name: {
      me: 'Premium Paket sa Termosom',
      en: 'Premium Package with Thermos'
    },
    price: 50,
    minOrder: 30,
    category: 'newyear',
    image: premiumThermos,
    items: {
      me: [
        'Termos 570 ml',
        'Pljoska 115 ml',
        'Teglica organskog domaćeg meda 250 ml',
        'Platnena kesica domaćeg čaja 50 g',
        'Drvena kašičica',
        'Novogodišnja čestitka',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'Thermos 570 ml',
        'Hip flask 115 ml',
        'Organic local honey jar 250 ml',
        'Linen tea bag 50 g',
        'Wooden spoon',
        "New Year's greeting card",
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Visokokvalitetni termos sa dvostrukom personalizacijom - na poklopcu i na boci.',
          en: 'High-quality thermos with double customization - on lid and bottle.'
        },
        specs: { me: 'Zapremina: 570 ml | Dostupno u 5 boja', en: 'Capacity: 570 ml | Available in 5 colors' },
        images: [thermoBottle]
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
        specs: { me: 'Težina: 250 ml | Dimenzija naljepnice: 5.6 cm x 10.5 cm', en: 'Weight: 250 ml | Label size: 5.6 cm x 10.5 cm' },
        images: [honeyJar]
      },
      {
        name: { me: 'Platnena Kesica Čaja', en: 'Linen Tea Bag' },
        description: { 
          me: 'Organski čaj sa personalizacijom i naglaskom na crnogorsku proizvodnju.',
          en: 'Organic tea with customization emphasizing Montenegrin production.'
        },
        specs: { me: 'Težina: 50 g', en: 'Weight: 50 g' },
        images: [teaBag]
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
    id: 'ny-olive',
    name: {
      me: 'Premium Paket sa Maslinovim Uljem',
      en: 'Premium Package with Olive Oil'
    },
    price: 41,
    minOrder: 30,
    category: 'newyear',
    image: premiumOlive,
    items: {
      me: [
        'Premium crnogorsko maslinovo ulje 250 ml',
        'Privjezak',
        'Vakumirane masline 100 g',
        'Platnena kesica organskog orašastog voća 100 g',
        'Novogodišnja čestitka',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'Premium Montenegrin olive oil 250 ml',
        'Keychain',
        'Vacuum packed olives 100 g',
        'Linen bag with organic nuts 100 g',
        "New Year's greeting card",
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'Premium Maslinovo Ulje', en: 'Premium Olive Oil' },
        description: { 
          me: 'Ekstra devičansko crnogorsko maslinovo ulje #1 sa personalizovanom etiketom.',
          en: 'Extra virgin Montenegrin olive oil #1 with personalized label.'
        },
        specs: { me: 'Zapremina: 250 ml | Ekstra devičansko', en: 'Volume: 250 ml | Extra virgin' },
        images: [oliveOil]
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
    id: 'corp-basic-bag',
    name: {
      me: 'Osnovni Korporativni Paket sa Kesom',
      en: 'Basic Corporate Package with Bag'
    },
    price: 20,
    minOrder: 30,
    category: 'corporate',
    image: basicCorporateBag,
    items: {
      me: [
        'A5 notes',
        'Metalna hemijska olovka',
        'Boca za vodu 650 ml',
        'Metalni privezak',
        'Kesa - pakovanje'
      ],
      en: [
        'A5 notebook',
        'Metal pen',
        'Water bottle 650 ml',
        'Metal keychain',
        'Bag packaging'
      ]
    },
    products: [
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Kvalitetni notes sa držačem za olovku i unutrašnjim džepom. Štampa logotipa.',
          en: 'Quality notebook with pen holder and inner pocket. Logo printing.'
        },
        specs: { me: 'Format: A5 | Dostupno u 7 boja', en: 'Format: A5 | Available in 7 colors' },
        images: [notebook]
      },
      {
        name: { me: 'Metalna Hemijska Olovka', en: 'Metal Pen' },
        description: { 
          me: 'Elegantna metalna olovka sa gumiranom površinom i personalizacijom.',
          en: 'Elegant metal pen with rubberized surface and customization.'
        },
        specs: { me: 'Dostupno u 16 boja', en: 'Available in 16 colors' },
        images: [metalPen]
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
    id: 'corp-basic-box',
    name: {
      me: 'Osnovni Korporativni Paket sa Kutijom',
      en: 'Basic Corporate Package with Box'
    },
    price: 32,
    minOrder: 30,
    category: 'corporate',
    image: corporateBox,
    items: {
      me: [
        'A5 notes',
        'Metalna hemijska olovka',
        'Termos 500 ml',
        'Metalni privezak',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'A5 notebook',
        'Metal pen',
        'Thermos 500 ml',
        'Metal keychain',
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Notes sa fleksibilnom koricom, zaobljenim ivicama i elastičnom gumicom.',
          en: 'Notebook with flexible cover, rounded edges and elastic band.'
        },
        specs: { me: 'Format: A5 | Dostupno u 5 boja', en: 'Format: A5 | Available in 5 colors' },
        images: [notebook]
      },
      {
        name: { me: 'Metalna Hemijska Olovka', en: 'Metal Pen' },
        description: { 
          me: 'Premium metalna olovka sa gumiranom površinom.',
          en: 'Premium metal pen with rubberized surface.'
        },
        specs: { me: 'Dostupno u 9 boja', en: 'Available in 9 colors' },
        images: [metalPen]
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Visokokvalitetni termos sa štampom logotipa.',
          en: 'High-quality thermos with logo printing.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 5 boja', en: 'Capacity: 500 ml | Available in 5 colors' },
        images: [thermoBottle]
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
    id: 'corp-active',
    name: {
      me: 'Active Life',
      en: 'Active Life'
    },
    price: 50,
    minOrder: 30,
    category: 'corporate',
    image: activeLife,
    items: {
      me: [
        'Powerbank 5000mAh',
        'A5 notes',
        'Termos 500 ml',
        'Metalni privezak',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'Powerbank 5000mAh',
        'A5 notebook',
        'Thermos 500 ml',
        'Metal keychain',
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'Powerbank 5000mAh', en: 'Powerbank 5000mAh' },
        description: { 
          me: 'Kompaktni powerbank sa štampom logotipa za punjenje uređaja u pokretu.',
          en: 'Compact powerbank with logo printing for charging devices on the go.'
        },
        specs: { me: 'Kapacitet: 5000mAh | Dostupno u 3 boje', en: 'Capacity: 5000mAh | Available in 3 colors' },
        images: [powerbank]
      },
      {
        name: { me: 'A5 Notes', en: 'A5 Notebook' },
        description: { 
          me: 'Notes sa fleksibilnom koricom i elastičnom gumicom.',
          en: 'Notebook with flexible cover and elastic band.'
        },
        specs: { me: 'Format: A5 | Dostupno u 5 boja', en: 'Format: A5 | Available in 5 colors' },
        images: [notebook]
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Termos sa personalizacijom za aktivan životni stil.',
          en: 'Thermos with customization for active lifestyle.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 3 boje', en: 'Capacity: 500 ml | Available in 3 colors' },
        images: [thermoBottle]
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
    id: 'corp-smart',
    name: {
      me: 'Smart Living',
      en: 'Smart Living'
    },
    price: 70,
    minOrder: 30,
    category: 'corporate',
    image: smartLiving,
    items: {
      me: [
        '3-in-1 wireless charger',
        'Prenosivi 3W zvučnik',
        'Termos 500 ml',
        'Čestitka',
        'Kutija - custom made pakovanje'
      ],
      en: [
        '3-in-1 wireless charger',
        'Portable 3W speaker',
        'Thermos 500 ml',
        'Greeting card',
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: '3-in-1 Wireless Charger', en: '3-in-1 Wireless Charger' },
        description: { 
          me: 'Prenosni bežični punjač za istovremeno punjenje 3 uređaja (telefon, slušalice, sat).',
          en: 'Portable wireless charger for simultaneous charging of 3 devices (phone, earbuds, watch).'
        },
        specs: { me: 'Dostupno u 2 boje | Štampa logotipa', en: 'Available in 2 colors | Logo printing' },
        images: [wirelessCharger]
      },
      {
        name: { me: 'Prenosivi 3W Zvučnik', en: 'Portable 3W Speaker' },
        description: { 
          me: 'Zvučnik od recikliranog ABS materijala sa LED trakom. BT 5.0, autonomija do 4 sata.',
          en: 'Speaker made from recycled ABS material with LED strip. BT 5.0, up to 4 hours autonomy.'
        },
        specs: { me: 'Snaga: 3W | Dostupno u 2 boje', en: 'Power: 3W | Available in 2 colors' },
        images: [bluetoothSpeaker]
      },
      {
        name: { me: 'Termos', en: 'Thermos' },
        description: { 
          me: 'Premium termos sa personalizacijom.',
          en: 'Premium thermos with customization.'
        },
        specs: { me: 'Zapremina: 500 ml | Dostupno u 5 boja', en: 'Capacity: 500 ml | Available in 5 colors' },
        images: [thermoBottle]
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
    id: 'corp-eco',
    name: {
      me: 'Eko Održivi Paket',
      en: 'Eco Sustainable Package'
    },
    price: 42,
    minOrder: 30,
    category: 'corporate',
    image: ecoFriendly,
    items: {
      me: [
        'A5 notes od papira šećerne trske',
        'Hemijska olovka od pluta',
        'Termos od bambusa 440 ml',
        'Drveni privezak',
        'Čestitka',
        'Kutija - custom made pakovanje'
      ],
      en: [
        'A5 notebook from sugarcane paper',
        'Cork pen',
        'Bamboo thermos 440 ml',
        'Wooden keychain',
        'Greeting card',
        'Custom made box packaging'
      ]
    },
    products: [
      {
        name: { me: 'A5 Notes od Šećerne Trske', en: 'A5 Sugarcane Notebook' },
        description: { 
          me: 'Eko notes izrađen od papira šećerne trske sa zaobljenim ivicama.',
          en: 'Eco notebook made from sugarcane paper with rounded edges.'
        },
        specs: { me: 'Format: A5 | Prirodan materijal', en: 'Format: A5 | Natural material' },
        images: [notebook]
      },
      {
        name: { me: 'Olovka od Pluta', en: 'Cork Pen' },
        description: { 
          me: 'Eko olovka od pluta i vlakna pšenične slame sa personalizacijom.',
          en: 'Eco pen made from cork and wheat straw fiber with customization.'
        },
        specs: { me: 'Prirodni materijali', en: 'Natural materials' },
        images: [metalPen]
      },
      {
        name: { me: 'Termos od Bambusa', en: 'Bamboo Thermos' },
        description: { 
          me: 'Održivi termos od bambusa sa štampom logotipa.',
          en: 'Sustainable bamboo thermos with logo printing.'
        },
        specs: { me: 'Zapremina: 440 ml | Bambus', en: 'Capacity: 440 ml | Bamboo' },
        images: [bambooThermos]
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
