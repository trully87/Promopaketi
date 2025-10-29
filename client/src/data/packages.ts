import basicNewyear from '@assets/generated_images/Basic_New_Year_package_69461e16.png';
import standardNewyear from '@assets/generated_images/Standard_New_Year_package_413cce95.png';
import premiumThermos from '@assets/generated_images/Premium_thermos_package_a58f5ba6.png';
import premiumOlive from '@assets/generated_images/Premium_olive_oil_package_f3f06b68.png';
import basicCorporateBag from '@assets/generated_images/Basic_corporate_package_bag_71ed2de4.png';
import corporateBox from '@assets/generated_images/Corporate_package_with_box_2c8d7f38.png';
import activeLife from '@assets/generated_images/Active_life_corporate_package_913e5fa0.png';
import smartLiving from '@assets/generated_images/Smart_living_tech_package_65d3a7a1.png';
import ecoFriendly from '@assets/generated_images/Eco_sustainable_corporate_package_6612baf2.png';

export interface Package {
  id: string;
  name: { me: string; en: string };
  price: number;
  minOrder: number;
  category: 'newyear' | 'corporate';
  image: string;
  items: { me: string[]; en: string[] };
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];
