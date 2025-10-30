const API = 'http://localhost:5000/api';
let sessionCookie = '';

async function login() {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  sessionCookie = res.headers.get('set-cookie');
  console.log('✓ Logged in');
}

async function createPackage(pkg) {
  const res = await fetch(`${API}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
    body: JSON.stringify(pkg)
  });
  return await res.json();
}

async function createProduct(product) {
  const res = await fetch(`${API}/package-products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
    body: JSON.stringify(product)
  });
  return await res.json();
}

const packages = [
  // NOVOGODIŠNJI PAKETI (4)
  {
    nameME: "Zlatna Novogodišnja Elegancija",
    nameEN: "Golden New Year Elegance",
    price: 85,
    minOrder: 30,
    category: "newyear",
    image: "/uploads/luxury_new_year_corp_81b9e67d.jpg",
    products: [
      { nameME: "Premium Šampanjac", nameEN: "Premium Champagne", descriptionME: "Fino pjenušavo vino sa zlatnim notama i bisernim mjehurićima", descriptionEN: "Fine sparkling wine with golden notes and pearl bubbles", specsME: "Zapremina: 750ml | Alkohol: 12% | Porijeklo: Francuska", specsEN: "Volume: 750ml | Alcohol: 12% | Origin: France" },
      { nameME: "Luksuzna Čokolada", nameEN: "Luxury Chocolate", descriptionME: "Ručno rađena belgijska čokolada sa zlatnim listićima", descriptionEN: "Handmade Belgian chocolate with gold leaf", specsME: "Težina: 200g | Sadržaj kakaa: 70%", specsEN: "Weight: 200g | Cocoa content: 70%" },
      { nameME: "Novogodišnje Ukrasne Svijeće", nameEN: "New Year Decorative Candles", descriptionME: "Set od 3 mirisne svijeće sa zlatnim detaljima", descriptionEN: "Set of 3 scented candles with gold details", specsME: "Miris: Vanila i cimet | Trajanje: 40 sati", specsEN: "Scent: Vanilla and cinnamon | Duration: 40 hours" }
    ]
  },
  {
    nameME: "Prestižni Novogodišnji Set",
    nameEN: "Prestige New Year Set",
    price: 120,
    minOrder: 30,
    category: "newyear",
    image: "/uploads/luxury_new_year_corp_b1d71d10.jpg",
    products: [
      { nameME: "Premium Prosecco", nameEN: "Premium Prosecco", descriptionME: "Italijansko pjenušavo vino vrhunskog kvaliteta", descriptionEN: "Italian sparkling wine of superior quality", specsME: "Zapremina: 750ml | Regija: Veneto | Godina: 2023", specsEN: "Volume: 750ml | Region: Veneto | Year: 2023" },
      { nameME: "Gourmet Praline", nameEN: "Gourmet Pralines", descriptionME: "Asortiman fine švajcarske čokolade sa raznim filovima", descriptionEN: "Assortment of fine Swiss chocolates with various fillings", specsME: "Komada: 24 | Pakovanje: Zlatna kutija", specsEN: "Pieces: 24 | Packaging: Gold box" },
      { nameME: "Premium Kahva i Keks", nameEN: "Premium Coffee & Cookies", descriptionME: "Specialty coffee beans i ručno pravljen novogodišnji keks", descriptionEN: "Specialty coffee beans and handmade New Year cookies", specsME: "Kahva: 250g Arabica | Keks: 150g mix", specsEN: "Coffee: 250g Arabica | Cookies: 150g mix" }
    ]
  },
  {
    nameME: "Novogodišnji Luksuz",
    nameEN: "New Year Luxury",
    price: 95,
    minOrder: 30,
    category: "newyear",
    image: "/uploads/luxury_new_year_corp_f62f38df.jpg",
    products: [
      { nameME: "Cava Pjenušac", nameEN: "Cava Sparkling Wine", descriptionME: "Španski pjenušac tradicionalne proizvodnje", descriptionEN: "Spanish sparkling wine of traditional production", specsME: "Zapremina: 750ml | Metoda: Tradicionalna | Regija: Katalonija", specsEN: "Volume: 750ml | Method: Traditional | Region: Catalonia" },
      { nameME: "Luksuzni Bomboni", nameEN: "Luxury Bonbons", descriptionME: "Ručno pravljeni francuske praline sa likericama", descriptionEN: "Handmade French pralines with liqueurs", specsME: "Težina: 300g | Broj komada: 18", specsEN: "Weight: 300g | Number of pieces: 18" },
      { nameME: "Premium Sušeno Voće", nameEN: "Premium Dried Fruit", descriptionME: "Mix sušenog voća i orašastih plodova u elegantnoj ambalaži", descriptionEN: "Mix of dried fruits and nuts in elegant packaging", specsME: "Težina: 250g | Sastav: Smokve, kajsije, orasi, bademi", specsEN: "Weight: 250g | Contents: Figs, apricots, walnuts, almonds" }
    ]
  },
  {
    nameME: "Tradicionalni Novogodišnji Paket",
    nameEN: "Traditional New Year Package",
    price: 75,
    minOrder: 30,
    category: "newyear",
    image: "/uploads/luxury_new_year_corp_38c180c2.jpg",
    products: [
      { nameME: "Domaće Pjenušavo Vino", nameEN: "Domestic Sparkling Wine", descriptionME: "Kvalitetno pjenušavo vino lokalne proizvodnje", descriptionEN: "Quality sparkling wine of local production", specsME: "Zapremina: 750ml | Sorta: Chardonnay", specsEN: "Volume: 750ml | Variety: Chardonnay" },
      { nameME: "Slatki Novogodišnji Mix", nameEN: "Sweet New Year Mix", descriptionME: "Tradicionalni slatkiši i kolačići", descriptionEN: "Traditional sweets and cookies", specsME: "Težina: 400g | Raznovrsnost: 6 vrsta", specsEN: "Weight: 400g | Variety: 6 types" },
      { nameME: "Novogodišnja Dekoracija", nameEN: "New Year Decoration", descriptionME: "Elegantni dekor sa čestitkom", descriptionEN: "Elegant decor with greeting card", specsME: "Materijal: Zlatna traka i ukrasna kartica", specsEN: "Material: Gold ribbon and decorative card" }
    ]
  },
  // KORPORATIVNI PAKETI (4)
  {
    nameME: "Executive Business Paket",
    nameEN: "Executive Business Package",
    price: 145,
    minOrder: 30,
    category: "corporate",
    image: "/uploads/elegant_corporate_bu_1b4c8bae.jpg",
    products: [
      { nameME: "Premium Kožna Fascikla", nameEN: "Premium Leather Portfolio", descriptionME: "Italijanska prava koža sa zlatnim detaljima i prostorom za dokumente", descriptionEN: "Italian genuine leather with gold details and document space", specsME: "Materijal: 100% prava koža | Boja: Tamno smeđa | Dimenzije: A4", specsEN: "Material: 100% genuine leather | Color: Dark brown | Size: A4" },
      { nameME: "Parker Hemijska Olovka", nameEN: "Parker Ballpoint Pen", descriptionME: "Elegantna Parker olovka sa gravirom", descriptionEN: "Elegant Parker pen with engraving", specsME: "Materijal: Čelik i pozlata | Personalizovano: Da", specsEN: "Material: Steel and gold plating | Personalized: Yes" },
      { nameME: "Moleskine Notesnik", nameEN: "Moleskine Notebook", descriptionME: "Premium notesnik sa tvrdom koricama", descriptionEN: "Premium notebook with hard cover", specsME: "Stranica: 240 | Format: A5 | Boja: Crna", specsEN: "Pages: 240 | Format: A5 | Color: Black" }
    ]
  },
  {
    nameME: "Korporativni Premium Set",
    nameEN: "Corporate Premium Set",
    price: 110,
    minOrder: 30,
    category: "corporate",
    image: "/uploads/elegant_corporate_bu_6997c9d7.jpg",
    products: [
      { nameME: "Premium USB Flash Drive", nameEN: "Premium USB Flash Drive", descriptionME: "Metalni USB sa gravirom firme", descriptionEN: "Metal USB with company engraving", specsME: "Kapacitet: 64GB | USB 3.0 | Materijal: Aluminijum", specsEN: "Capacity: 64GB | USB 3.0 | Material: Aluminum" },
      { nameME: "Poslovna Termosica", nameEN: "Business Thermos", descriptionME: "Nerđajuća čelična termosica sa logoom", descriptionEN: "Stainless steel thermos with logo", specsME: "Zapremina: 500ml | Održavanje temperature: 12h", specsEN: "Volume: 500ml | Temperature retention: 12h" },
      { nameME: "Elegantni Notesnik", nameEN: "Elegant Notebook", descriptionME: "Ekološki notesnik sa magnetnim zatvaračem", descriptionEN: "Eco notebook with magnetic closure", specsME: "Stranica: 180 | Papir: Reciklirani | Format: A5", specsEN: "Pages: 180 | Paper: Recycled | Format: A5" }
    ]
  },
  {
    nameME: "Business Elite Paket",
    nameEN: "Business Elite Package",
    price: 165,
    minOrder: 30,
    category: "corporate",
    image: "/uploads/elegant_corporate_bu_bc1e8835.jpg",
    products: [
      { nameME: "Luksuzni Set za Pisanje", nameEN: "Luxury Writing Set", descriptionME: "Set hemijske i nalivpera u drvenoj kutiji", descriptionEN: "Ballpoint and fountain pen set in wooden box", specsME: "Materijal: Pozlaćeni metal | Pakovanje: Drvena kutija sa velvet futrolom", specsEN: "Material: Gold-plated metal | Packaging: Wooden box with velvet case" },
      { nameME: "Premium Power Bank", nameEN: "Premium Power Bank", descriptionME: "Elegantni punjač sa wireless charging-om", descriptionEN: "Elegant charger with wireless charging", specsME: "Kapacitet: 10000mAh | Portovi: USB-C, USB-A, Wireless", specsEN: "Capacity: 10000mAh | Ports: USB-C, USB-A, Wireless" },
      { nameME: "Poslovna Torba", nameEN: "Business Bag", descriptionME: "Kožna torba za laptop i dokumente", descriptionEN: "Leather bag for laptop and documents", specsME: "Materijal: Prava koža | Laptop: Do 15.6'' | Boja: Crna", specsEN: "Material: Genuine leather | Laptop: Up to 15.6'' | Color: Black" }
    ]
  },
  {
    nameME: "Korporativni Essentials",
    nameEN: "Corporate Essentials",
    price: 85,
    minOrder: 30,
    category: "corporate",
    image: "/uploads/elegant_corporate_bu_ecb1c3f1.jpg",
    products: [
      { nameME: "Personalizovana Olovka", nameEN: "Personalized Pen", descriptionME: "Metalna olovka sa gravurom imena", descriptionEN: "Metal pen with name engraving", specsME: "Materijal: Čelik | Boja: Plava/Crna | Gravura: Besplatna", specsEN: "Material: Steel | Color: Blue/Black | Engraving: Free" },
      { nameME: "Premium Notesnik A5", nameEN: "Premium Notebook A5", descriptionME: "Tvrd povez sa elastičnom trakom", descriptionEN: "Hard cover with elastic band", specsME: "Stranica: 200 | Papir: 100g/m² | Boje: 3 opcije", specsEN: "Pages: 200 | Paper: 100g/m² | Colors: 3 options" },
      { nameME: "Bluetooth Slušalice", nameEN: "Bluetooth Headphones", descriptionME: "Kompaktne wireless slušalice za poslovne pozive", descriptionEN: "Compact wireless headphones for business calls", specsME: "Baterija: 8h | Bluetooth 5.0 | Noise cancelling", specsEN: "Battery: 8h | Bluetooth 5.0 | Noise cancelling" }
    ]
  }
];

await login();
let count = 0;
for (const pkg of packages) {
  const { products, ...pkgData } = pkg;
  const created = await createPackage(pkgData);
  if (created?.id) {
    console.log(`✓ ${pkgData.nameME}`);
    for (let i = 0; i < products.length; i++) {
      await createProduct({ ...products[i], packageId: created.id, sortOrder: i });
    }
    count++;
  }
}
console.log(`\n✓ Created ${count} packages total`);
