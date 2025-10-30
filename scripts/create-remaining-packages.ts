import { db } from '../server/storage';
import * as schema from '../shared/schema';

const packages = [
  // EKO PAKETI (4)
  {
    pkg: { nameME: "Prirodni Eko Set", nameEN: "Natural Eco Set", price: 95, minOrder: 30, category: "eko", image: "/uploads/eco_friendly_sustain_9671e4fb.jpg" },
    products: [
      { nameME: "Bambusova Termo Čaša", nameEN: "Bamboo Thermal Cup", descriptionME: "Ekološka termo čaša od bambusa", descriptionEN: "Eco-friendly bamboo thermal cup", specsME: "Zapremina: 400ml | Materijal: 100% bambus | Održavanje: 6h", specsEN: "Volume: 400ml | Material: 100% bamboo | Retention: 6h" },
      { nameME: "Organski Čaj Set", nameEN: "Organic Tea Set", descriptionME: "Kolekcija organskih čajeva u recikliranoj ambalaži", descriptionEN: "Collection of organic teas in recycled packaging", specsME: "Vrste: 5 | Težina: 150g | Certifikat: Bio", specsEN: "Types: 5 | Weight: 150g | Certificate: Organic" },
      { nameME: "Ekološki Notesnik", nameEN: "Eco Notebook", descriptionME: "Notesnik od recikliranog papira", descriptionEN: "Notebook made from recycled paper", specsME: "Stranica: 100 | Papir: 100% reciklirani", specsEN: "Pages: 100 | Paper: 100% recycled" }
    ]
  },
  {
    pkg: { nameME: "Zeleni Luksuz", nameEN: "Green Luxury", price: 120, minOrder: 30, category: "eko", image: "/uploads/eco_friendly_sustain_d4073d02.jpg" },
    products: [
      { nameME: "Premium Eko Torba", nameEN: "Premium Eco Bag", descriptionME: "Luksuzna torba od organskog pamuka", descriptionEN: "Luxury bag made from organic cotton", specsME: "Materijal: Organski pamuk | Nosivost: 10kg", specsEN: "Material: Organic cotton | Capacity: 10kg" },
      { nameME: "Prirodni Sapuni Set", nameEN: "Natural Soap Set", descriptionME: "Ručno pravljeni sapuni od prirodnih sastojaka", descriptionEN: "Handmade soaps from natural ingredients", specsME: "Komada: 4 | Težina: 400g | Bez hemikalija", specsEN: "Pieces: 4 | Weight: 400g | Chemical-free" },
      { nameME: "Staklena Boca za Vodu", nameEN: "Glass Water Bottle", descriptionME: "Premium staklena boca sa zaštitnim omot ačem", descriptionEN: "Premium glass bottle with protective sleeve", specsME: "Zapremina: 750ml | Materijal: Borosilikatno staklo", specsEN: "Volume: 750ml | Material: Borosilicate glass" }
    ]
  },
  {
    pkg: { nameME: "Eko Wellness Paket", nameEN: "Eco Wellness Package", price: 110, minOrder: 30, category: "eko", image: "/uploads/eco_friendly_sustain_eec61485.jpg" },
    products: [
      { nameME: "Joga Prostirka od Pluta", nameEN: "Cork Yoga Mat", descriptionME: "Prirodna joga prostirka od pluta i gume", descriptionEN: "Natural yoga mat made from cork and rubber", specsME: "Dimenzije: 183x61cm | Debljina: 5mm | Ekološki", specsEN: "Dimensions: 183x61cm | Thickness: 5mm | Eco-friendly" },
      { nameME: "Aromaterapija Set", nameEN: "Aromatherapy Set", descriptionME: "Eterična ulja od organskih biljaka", descriptionEN: "Essential oils from organic plants", specsME: "Ulja: Lavanda, eukaliptus, nana | Po 10ml", specsEN: "Oils: Lavender, eucalyptus, mint | 10ml each" },
      { nameME: "Bambus Četkica za Zube", nameEN: "Bamboo Toothbrush", descriptionME: "Set od 4 ekološke četkice", descriptionEN: "Set of 4 eco-friendly toothbrushes", specsME: "Materijal: Bambus | Biodegradabilno", specsEN: "Material: Bamboo | Biodegradable" }
    ]
  },
  {
    pkg: { nameME: "Održivi Lifestyle Set", nameEN: "Sustainable Lifestyle Set", price: 85, minOrder: 30, category: "eko", image: "/uploads/eco_friendly_sustain_509fa1e0.jpg" },
    products: [
      { nameME: "Inox Slamčice Set", nameEN: "Stainless Steel Straws Set", descriptionME: "Višekratne inox slamčice sa četkicom", descriptionEN: "Reusable stainless steel straws with brush", specsME: "Komada: 8 | Materijal: Nerđajući čelik", specsEN: "Pieces: 8 | Material: Stainless steel" },
      { nameME: "Pamučne Kese za Namirnice", nameEN: "Cotton Produce Bags", descriptionME: "Set organskih kesa za voće i povrće", descriptionEN: "Set of organic bags for fruits and vegetables", specsME: "Komada: 5 | Veličine: S, M, L | Organski pamuk", specsEN: "Pieces: 5 | Sizes: S, M, L | Organic cotton" },
      { nameME: "Čvrsti Šampon", nameEN: "Solid Shampoo Bar", descriptionME: "Prirodni šampon bez plastike", descriptionEN: "Natural shampoo without plastic", specsME: "Težina: 100g | Trajanje: kao 2 flaše", specsEN: "Weight: 100g | Lasts: as 2 bottles" }
    ]
  },

  // LOKALNI PROIZVOĐAČI (4)
  {
    pkg: { nameME: "Crnogorski Delikates", nameEN: "Montenegrin Delicacies", price: 105, minOrder: 30, category: "lokalni", image: "/uploads/local_artisan_gourme_41394fa0.jpg" },
    products: [
      { nameME: "Domaći Med", nameEN: "Local Honey", descriptionME: "Prirodni med sa crnogorskih planina", descriptionEN: "Natural honey from Montenegrin mountains", specsME: "Težina: 500g | Vrsta: Livadski | Porijeklo: Kolašin", specsEN: "Weight: 500g | Type: Meadow | Origin: Kolašin" },
      { nameME: "Maslinovo Ulje Extra Virgin", nameEN: "Extra Virgin Olive Oil", descriptionME: "Hladno ceđeno ulje sa crnogorske obale", descriptionEN: "Cold-pressed oil from Montenegrin coast", specsME: "Zapremina: 500ml | Ekstra djevičansko | Bar region", specsEN: "Volume: 500ml | Extra virgin | Bar region" },
      { nameME: "Domaći Pršut", nameEN: "Local Prosciutto", descriptionME: "Tradicionalni crnogorski pršut", descriptionEN: "Traditional Montenegrin prosciutto", specsME: "Težina: 200g | Sušenje: 12 mjeseci | Ručna proizvodnja", specsEN: "Weight: 200g | Cured: 12 months | Handmade" }
    ]
  },
  {
    pkg: { nameME: "Autentični Ukusi", nameEN: "Authentic Flavors", price: 125, minOrder: 30, category: "lokalni", image: "/uploads/local_artisan_gourme_d6a2c73b.jpg" },
    products: [
      { nameME: "Autohtono Vino", nameEN: "Autochthonous Wine", descriptionME: "Crnogorsko vino od Vranac sorte", descriptionEN: "Montenegrin wine from Vranac variety", specsME: "Zapremina: 750ml | Godina: 2022 | Plantaže", specsEN: "Volume: 750ml | Year: 2022 | Plantaže" },
      { nameME: "Njeguški Sir", nameEN: "Njeguši Cheese", descriptionME: "Tradicionalni tvrdi sir iz Njeguša", descriptionEN: "Traditional hard cheese from Njeguši", specsME: "Težina: 300g | Zrenje: 6 mjeseci", specsEN: "Weight: 300g | Aged: 6 months" },
      { nameME: "Rakija Loza", nameEN: "Grape Brandy", descriptionME: "Domaća rakija od lokalnih sorti grožđa", descriptionEN: "Homemade brandy from local grape varieties", specsME: "Zapremina: 700ml | Alkohol: 45% | Craft", specsEN: "Volume: 700ml | Alcohol: 45% | Craft" }
    ]
  },
  {
    pkg: { nameME: "Planinski Dar", nameEN: "Mountain Gift", price: 95, minOrder: 30, category: "lokalni", image: "/uploads/local_artisan_gourme_b1a1ab16.jpg" },
    products: [
      { nameME: "Divlji Čaj", nameEN: "Wild Tea", descriptionME: "Biljni čaj sa Durmitora", descriptionEN: "Herbal tea from Durmitor", specsME: "Težina: 100g | Vrste: Kamilica, nana, hajdučka trava", specsEN: "Weight: 100g | Types: Chamomile, mint, wild tea" },
      { nameME: "Ajvar od Crvene Paprike", nameEN: "Red Pepper Ajvar", descriptionME: "Domaći ajvar bez konzervansa", descriptionEN: "Homemade ajvar without preservatives", specsME: "Zapremina: 350g | 100% prirodno | Ručna proizvodnja", specsEN: "Volume: 350g | 100% natural | Handmade" },
      { nameME: "Planinski Džem", nameEN: "Mountain Jam", descriptionME: "Set domaćih džemova od šumskog voća", descriptionEN: "Set of homemade jams from forest fruits", specsME: "Vrste: 3 (malina, borovnica, kupina) | Po 250g", specsEN: "Types: 3 (raspberry, blueberry, blackberry) | 250g each" }
    ]
  },
  {
    pkg: { nameME: "Tradicionalna Baština", nameEN: "Traditional Heritage", price: 115, minOrder: 30, category: "lokalni", image: "/uploads/local_artisan_gourme_3b54630c.jpg" },
    products: [
      { nameME: "Domaća Kobasica", nameEN: "Homemade Sausage", descriptionME: "Suva kobasica tradicionalnog recepta", descriptionEN: "Dried sausage of traditional recipe", specsME: "Težina: 300g | Sušenje: Prirodno | Bez aditiva", specsEN: "Weight: 300g | Drying: Natural | No additives" },
      { nameME: "Crnogorski Liker", nameEN: "Montenegrin Liqueur", descriptionME: "Prirodni liker od šumskih plodova", descriptionEN: "Natural liqueur from forest fruits", specsME: "Zapremina: 500ml | Sorte: Borovnica/Malina | Craft", specsEN: "Volume: 500ml | Varieties: Blueberry/Raspberry | Craft" },
      { nameME: "Kacka masa", nameEN: "Traditional Kaymak", descriptionME: "Autentični kajmak sa Durmitora", descriptionEN: "Authentic kaymak from Durmitor", specsME: "Težina: 250g | Svježe | Planinska mljekarnica", specsEN: "Weight: 250g | Fresh | Mountain dairy" }
    ]
  },

  // PREMIUM VIP (4)
  {
    pkg: { nameME: "Black Label Exclusive", nameEN: "Black Label Exclusive", price: 395, minOrder: 20, category: "premium-vip", image: "/uploads/vip_luxury_premium_g_da71c4e1.jpg" },
    products: [
      { nameME: "Dom Pérignon Šampanjac", nameEN: "Dom Pérignon Champagne", descriptionME: "Prestižni francuski šampanjac", descriptionEN: "Prestigious French champagne", specsME: "Zapremina: 750ml | Vintage | Luksuzno pakovanje", specsEN: "Volume: 750ml | Vintage | Luxury packaging" },
      { nameME: "Kavijär Premium", nameEN: "Premium Caviar", descriptionME: "Crni kavijär u kristalnoj posudi", descriptionEN: "Black caviar in crystal container", specsME: "Težina: 50g | Vrsta: Beluga | Hlađenje uključeno", specsEN: "Weight: 50g | Type: Beluga | Cooling included" },
      { nameME: "Gold Leaf Čokolada", nameEN: "Gold Leaf Chocolate", descriptionME: "Švajcarska čokolada sa listićima zlata", descriptionEN: "Swiss chocolate with gold leaf", specsME: "Težina: 200g | 24K zlato | Luksuzna kutija", specsEN: "Weight: 200g | 24K gold | Luxury box" }
    ]
  },
  {
    pkg: { nameME: "Platinum Collection", nameEN: "Platinum Collection", price: 450, minOrder: 20, category: "premium-vip", image: "/uploads/vip_luxury_premium_g_a88a2669.jpg" },
    products: [
      { nameME: "Kristal Champagne", nameEN: "Cristal Champagne", descriptionME: "Louis Roederer Cristal prestižno vino", descriptionEN: "Louis Roederer Cristal prestige wine", specsME: "Zapremina: 750ml | Premium cuvée | Limitirana edicija", specsEN: "Volume: 750ml | Premium cuvée | Limited edition" },
      { nameME: "Hermes Luxury Kožna Fascikla", nameEN: "Hermes Luxury Leather Portfolio", descriptionME: "Ekskluzivna kožna fascikla", descriptionEN: "Exclusive leather portfolio", specsME: "Materijal: Hermes koža | Monogram gravura | Ručno rađeno", specsEN: "Material: Hermes leather | Monogram engraving | Handmade" },
      { nameME: "Mont Blanc Nalivpero", nameEN: "Mont Blanc Fountain Pen", descriptionME: "Legendarna Mont Blanc olovka", descriptionEN: "Legendary Mont Blanc pen", specsME: "Kolekcija: Meisterstück | Platinski detalji", specsEN: "Collection: Meisterstück | Platinum details" }
    ]
  },
  {
    pkg: { nameME: "Diamond VIP Set", nameEN: "Diamond VIP Set", price: 525, minOrder: 20, category: "premium-vip", image: "/uploads/vip_luxury_premium_g_3d57f662.jpg" },
    products: [
      { nameME: "Rémy Martin Louis XIII", nameEN: "Rémy Martin Louis XIII", descriptionME: "Najluksuzniji konjak na svijetu", descriptionEN: "The world's most luxurious cognac", specsME: "Zapremina: 700ml | 100 godina starosti | Kristalna boca", specsEN: "Volume: 700ml | 100 years old | Crystal decanter" },
      { nameME: "Rolex Executive Watch", nameEN: "Rolex Executive Watch", descriptionME: "Švajcarski luksuzni sat", descriptionEN: "Swiss luxury watch", specsME: "Model: Datejust | Materijal: Zlato 18K | Automatik", specsEN: "Model: Datejust | Material: 18K gold | Automatic" },
      { nameME: "Lalique Crystal Set", nameEN: "Lalique Crystal Set", descriptionME: "Kristalna vaza i čaše od Lalique-a", descriptionEN: "Crystal vase and glasses from Lalique", specsME: "Komada: 6 čaša + vaza | Ručno izrađeno | Numerisano", specsEN: "Pieces: 6 glasses + vase | Handmade | Numbered" }
    ]
  },
  {
    pkg: { nameME: "Imperial Gold Package", nameEN: "Imperial Gold Package", price: 350, minOrder: 20, category: "premium-vip", image: "/uploads/vip_luxury_premium_g_266976c1.jpg" },
    products: [
      { nameME: "Veuve Clicquot Rosé", nameEN: "Veuve Clicquot Rosé", descriptionME: "Premium rosé šampanjac", descriptionEN: "Premium rosé champagne", specsME: "Zapremina: 750ml | Rosé | Zlatna kutija", specsEN: "Volume: 750ml | Rosé | Gold box" },
      { nameME: "Tiffany & Co Crystal Bowl", nameEN: "Tiffany & Co Crystal Bowl", descriptionME: "Kristalna činija luksuznog brenda", descriptionEN: "Crystal bowl from luxury brand", specsME: "Dimenzije: 25cm | Ručno graviranje | Original pakovanje", specsEN: "Dimensions: 25cm | Hand engraving | Original packaging" },
      { nameME: "Premium Whisky Selection", nameEN: "Premium Whisky Selection", descriptionME: "Kolekcija najfinijih viski brendova", descriptionEN: "Collection of finest whisky brands", specsME: "Boce: 3 (18yr, 21yr, 25yr) | Po 200ml | Luksuzna kutija", specsEN: "Bottles: 3 (18yr, 21yr, 25yr) | 200ml each | Luxury box" }
    ]
  },

  // TEHNOLOGIJA (4)
  {
    pkg: { nameME: "Tech Pro Paket", nameEN: "Tech Pro Package", price: 285, minOrder: 20, category: "tehnologija", image: "/uploads/premium_technology_g_26a2febf.jpg" },
    products: [
      { nameME: "Apple AirPods Pro", nameEN: "Apple AirPods Pro", descriptionME: "Premium bežične slušalice", descriptionEN: "Premium wireless earbuds", specsME: "Noise cancelling | Wireless charging | Spatial audio", specsEN: "Noise cancelling | Wireless charging | Spatial audio" },
      { nameME: "Anker PowerCore 20000", nameEN: "Anker PowerCore 20000", descriptionME: "Moćna prenosiva baterija", descriptionEN: "Powerful portable battery", specsME: "Kapacitet: 20000mAh | USB-C PD | 2 porta", specsEN: "Capacity: 20000mAh | USB-C PD | 2 ports" },
      { nameME: "Logitech MX Master 3S", nameEN: "Logitech MX Master 3S", descriptionME: "Premium bežični miš", descriptionEN: "Premium wireless mouse", specsME: "Ergonomski | Silent click | Multi-device", specsEN: "Ergonomic | Silent click | Multi-device" }
    ]
  },
  {
    pkg: { nameME: "Smart Office Set", nameEN: "Smart Office Set", price: 195, minOrder: 30, category: "tehnologija", image: "/uploads/premium_technology_g_5af2f739.jpg" },
    products: [
      { nameME: "Kindle Paperwhite", nameEN: "Kindle Paperwhite", descriptionME: "E-reader za čitanje", descriptionEN: "E-reader for reading", specsME: "Ekran: 6.8\" | Waterproof | 16GB memorije", specsEN: "Screen: 6.8\" | Waterproof | 16GB storage" },
      { nameME: "Philips Hue Smart Lights", nameEN: "Philips Hue Smart Lights", descriptionME: "Pametno LED osvetljenje", descriptionEN: "Smart LED lighting", specsME: "Sijalice: 3 | Boje: 16 miliona | App kontrola", specsEN: "Bulbs: 3 | Colors: 16 million | App control" },
      { nameME: "Bose SoundLink Mini", nameEN: "Bose SoundLink Mini", descriptionME: "Prenosni Bluetooth zvučnik", descriptionEN: "Portable Bluetooth speaker", specsME: "Baterija: 12h | Vodootporan | Premium zvuk", specsEN: "Battery: 12h | Waterproof | Premium sound" }
    ]
  },
  {
    pkg: { nameME: "Digital Lifestyle Paket", nameEN: "Digital Lifestyle Package", price: 325, minOrder: 20, category: "tehnologija", image: "/uploads/premium_technology_g_71ea5932.jpg" },
    products: [
      { nameME: "Samsung Galaxy Watch 6", nameEN: "Samsung Galaxy Watch 6", descriptionME: "Premium pametni sat", descriptionEN: "Premium smartwatch", specsME: "Ekran: AMOLED | Fitness tracking | NFC plaćanje", specsEN: "Display: AMOLED | Fitness tracking | NFC payment" },
      { nameME: "Sony WH-1000XM5", nameEN: "Sony WH-1000XM5", descriptionME: "Vrhunske noise-cancelling slušalice", descriptionEN: "Premium noise-cancelling headphones", specsME: "Baterija: 30h | Hi-Res Audio | Multi-point", specsEN: "Battery: 30h | Hi-Res Audio | Multi-point" },
      { nameME: "Anker Wireless Charger", nameEN: "Anker Wireless Charger", descriptionME: "3-u-1 bežični punjač", descriptionEN: "3-in-1 wireless charger", specsME: "Telefon + Watch + Slušalice | 15W fast charge", specsEN: "Phone + Watch + Earbuds | 15W fast charge" }
    ]
  },
  {
    pkg: { nameME: "Innovation Tech Set", nameEN: "Innovation Tech Set", price: 245, minOrder: 25, category: "tehnologija", image: "/uploads/premium_technology_g_fd9cccd7.jpg" },
    products: [
      { nameME: "GoPro HERO 12", nameEN: "GoPro HERO 12", descriptionME: "4K action kamera", descriptionEN: "4K action camera", specsME: "Video: 5.3K | Waterproof | Stabilizacija", specsEN: "Video: 5.3K | Waterproof | Stabilization" },
      { nameME: "Tile Mate Tracker", nameEN: "Tile Mate Tracker", descriptionME: "Bluetooth tracker set", descriptionEN: "Bluetooth tracker set", specsME: "Komada: 4 | Domet: 75m | Find My kompatibilno", specsEN: "Pieces: 4 | Range: 75m | Find My compatible" },
      { nameME: "Belkin 3-u-1 Hub", nameEN: "Belkin 3-in-1 Hub", descriptionME: "Premium USB-C hub", descriptionEN: "Premium USB-C hub", specsME: "Portovi: HDMI, USB-A, USB-C | 4K output", specsEN: "Ports: HDMI, USB-A, USB-C | 4K output" }
    ]
  },

  // SPORT I REKREACIJA (4)
  {
    pkg: { nameME: "Active Lifestyle Set", nameEN: "Active Lifestyle Set", price: 165, minOrder: 30, category: "sport", image: "/uploads/sports_fitness_gift__859b7e6a.jpg" },
    products: [
      { nameME: "Premium Joga Prostirka", nameEN: "Premium Yoga Mat", descriptionME: "Profesionalna joga podloga", descriptionEN: "Professional yoga mat", specsME: "Dimenzije: 183x61cm | Debljina: 6mm | Non-slip", specsEN: "Dimensions: 183x61cm | Thickness: 6mm | Non-slip" },
      { nameME: "Trake za Vježbanje", nameEN: "Resistance Bands", descriptionME: "Set elastičnih traka", descriptionEN: "Set of resistance bands", specsME: "Komada: 5 | Otpori: 5-50 kg | Sa torbom", specsEN: "Pieces: 5 | Resistance: 5-50 kg | With bag" },
      { nameME: "Sport Boca 1L", nameEN: "Sport Bottle 1L", descriptionME: "Profesionalna sportska boca", descriptionEN: "Professional sports bottle", specsME: "Zapremina: 1L | BPA free | Izolacija 24h", specsEN: "Volume: 1L | BPA free | Insulation 24h" }
    ]
  },
  {
    pkg: { nameME: "Fitness Pro Paket", nameEN: "Fitness Pro Package", price: 195, minOrder: 25, category: "sport", image: "/uploads/sports_fitness_gift__e8339ee5.jpg" },
    products: [
      { nameME: "Xiaomi Mi Band 8", nameEN: "Xiaomi Mi Band 8", descriptionME: "Fitness tracker narukvica", descriptionEN: "Fitness tracker bracelet", specsME: "Ekran: AMOLED | Baterija: 14 dana | Waterproof", specsEN: "Display: AMOLED | Battery: 14 days | Waterproof" },
      { nameME: "Skakaljka sa Brojačem", nameEN: "Smart Jump Rope", descriptionME: "Digitalna skakaljka", descriptionEN: "Digital jump rope", specsME: "Brojač: Kalorije i skokovi | LED displej", specsEN: "Counter: Calories and jumps | LED display" },
      { nameME: "Masažer Roller", nameEN: "Foam Roller", descriptionME: "Masažni valjak za oporavak", descriptionEN: "Massage roller for recovery", specsME: "Dužina: 33cm | Teksturirani | Lightweight", specsEN: "Length: 33cm | Textured | Lightweight" }
    ]
  },
  {
    pkg: { nameME: "Outdoor Adventure Set", nameEN: "Outdoor Adventure Set", price: 225, minOrder: 25, category: "sport", image: "/uploads/sports_fitness_gift__0d305a6e.jpg" },
    products: [
      { nameME: "Planinarski Ranac 30L", nameEN: "Hiking Backpack 30L", descriptionME: "Profesionalni ranac za planinarenje", descriptionEN: "Professional hiking backpack", specsME: "Zapremina: 30L | Waterproof | Ergonomski", specsEN: "Volume: 30L | Waterproof | Ergonomic" },
      { nameME: "LED Čeona Lampa", nameEN: "LED Headlamp", descriptionME: "Snažna LED lampa za glavu", descriptionEN: "Powerful LED headlamp", specsME: "Lumena: 1000 | Baterija: 20h | USB punjiva", specsEN: "Lumens: 1000 | Battery: 20h | USB rechargeable" },
      { nameME: "Multi-Tool Nož", nameEN: "Multi-Tool Knife", descriptionME: "Švajcarski višenamjenski alat", descriptionEN: "Swiss multi-purpose tool", specsME: "Funkcija: 15 | Nerđajući čelik | Leather futrola", specsEN: "Functions: 15 | Stainless steel | Leather case" }
    ]
  },
  {
    pkg: { nameME: "Wellness & Recovery Set", nameEN: "Wellness & Recovery Set", price: 175, minOrder: 30, category: "sport", image: "/uploads/sports_fitness_gift__b5ac20cb.jpg" },
    products: [
      { nameME: "Massage Gun", nameEN: "Massage Gun", descriptionME: "Električni masažer za mišiće", descriptionEN: "Electric muscle massager", specsME: "Brzine: 5 | Nastavci: 6 | Baterija: 6h", specsEN: "Speeds: 5 | Attachments: 6 | Battery: 6h" },
      { nameME: "Joga Blokovi i Kaiš", nameEN: "Yoga Blocks & Strap", descriptionME: "Pomoćni set za jogu", descriptionEN: "Yoga accessories set", specsME: "Blokovi: 2 | Kaiš: 250cm | Pamuk i pluto", specsEN: "Blocks: 2 | Strap: 250cm | Cotton and cork" },
      { nameME: "Kompresione Čarape", nameEN: "Compression Socks", descriptionME: "Sportske kompresione čarape", descriptionEN: "Sports compression socks", specsME: "Parova: 3 | Kompresija: 15-20 mmHg | Breathable", specsEN: "Pairs: 3 | Compression: 15-20 mmHg | Breathable" }
    ]
  }
];

async function main() {
  console.log('🚀 Kreiranje preostalih paketa...\n');
  
  let count = 0;
  for (const { pkg, products } of packages) {
    try {
      const [createdPackage] = await db.insert(schema.packages).values(pkg).returning();
      console.log(`✓ ${pkg.nameME}`);
      
      for (let i = 0; i < products.length; i++) {
        await db.insert(schema.packageProducts).values({
          ...products[i],
          packageId: createdPackage.id,
          sortOrder: i,
        });
      }
      count++;
    } catch (error) {
      console.error(`✗ Greška: ${pkg.nameME}`, error);
    }
  }
  
  console.log(`\n✅ Kreirano ${count}/${packages.length} paketa`);
  process.exit(0);
}

main();
