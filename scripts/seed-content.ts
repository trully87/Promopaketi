import { db } from '../server/storage';
import * as schema from '../shared/schema';

async function seedContent() {
  console.log('Seeding hero slides and menu items...');

  try {
    // Check if hero slides already exist
    const existingSlides = await db.select().from(schema.heroSlides);
    
    if (existingSlides.length === 0) {
      console.log('Adding hero slides...');
      
      const heroSlides = [
        {
          titleME: 'Premium Poklon Paketi',
          titleEN: 'Premium Gift Packages',
          subtitleME: 'Jedinstveni novogodišnji i korporativni pokloni sa personalizacijom',
          subtitleEN: 'Unique New Year and corporate gifts with personalization',
          image: '/attached_assets/generated_images/Hero_luxury_gift_packages_ecdca547.png',
          sortOrder: 0,
          isActive: 1
        },
        {
          titleME: 'Luksuzni Poklon Paketi',
          titleEN: 'Luxury Gift Boxes',
          subtitleME: 'Ekskluzivni pokloni koji ostavljaju utisak',
          subtitleEN: 'Exclusive gifts that leave an impression',
          image: '/attached_assets/generated_images/Luxury_gift_boxes_marble_7e7fe90d.png',
          sortOrder: 1,
          isActive: 1
        },
        {
          titleME: 'Korporativni Pokloni',
          titleEN: 'Corporate Gifts',
          subtitleME: 'Profesionalni paket i za vaše partnere i zaposlene',
          subtitleEN: 'Professional packages for your partners and employees',
          image: '/attached_assets/generated_images/Executive_corporate_hamper_desk_74479cd4.png',
          sortOrder: 2,
          isActive: 1
        },
        {
          titleME: 'Novogodišnja Kolekcija',
          titleEN: 'New Year Collection',
          subtitleME: 'Posebni paketi za novogodišnje praznike',
          subtitleEN: 'Special packages for New Year celebrations',
          image: '/attached_assets/generated_images/New_Year_luxury_collection_fdd3c4e8.png',
          sortOrder: 3,
          isActive: 1
        },
        {
          titleME: 'Eko Proizvodi',
          titleEN: 'Eco Products',
          subtitleME: 'Održivi i ekološki pokloni',
          subtitleEN: 'Sustainable and eco-friendly gifts',
          image: '/attached_assets/generated_images/Eco_corporate_products_wood_533f2d6b.png',
          sortOrder: 4,
          isActive: 1
        }
      ];

      for (const slide of heroSlides) {
        await db.insert(schema.heroSlides).values(slide);
      }
      
      console.log(`✓ Added ${heroSlides.length} hero slides`);
    } else {
      console.log(`Hero slides already exist (${existingSlides.length} slides)`);
    }

    // Check if menu items already exist
    const existingMenuItems = await db.select().from(schema.menuItems);
    
    if (existingMenuItems.length === 0) {
      console.log('Adding menu items...');
      
      const menuItems = [
        {
          labelME: 'Početna',
          labelEN: 'Home',
          path: '/',
          sortOrder: 0,
          isActive: 1
        },
        {
          labelME: 'Paketi',
          labelEN: 'Packages',
          path: '#packages',
          sortOrder: 1,
          isActive: 1
        },
        {
          labelME: 'Kontakt',
          labelEN: 'Contact',
          path: '#contact',
          sortOrder: 2,
          isActive: 1
        }
      ];

      for (const item of menuItems) {
        await db.insert(schema.menuItems).values(item);
      }
      
      console.log(`✓ Added ${menuItems.length} menu items`);
    } else {
      console.log(`Menu items already exist (${existingMenuItems.length} items)`);
    }

    // Check if contact info already exists
    const existingContactInfo = await db.select().from(schema.contactInfo);
    
    if (existingContactInfo.length === 0) {
      console.log('Adding contact info...');
      
      const contactInfo = {
        phone: '+382 67 123 456',
        email: 'info@brainbox.me',
        whatsapp: '+382 67 123 456',
        viber: '+382 67 123 456',
        addressME: 'Podgorica, Crna Gora',
        addressEN: 'Podgorica, Montenegro',
        mapLatitude: '42.4304',
        mapLongitude: '19.2594'
      };

      await db.insert(schema.contactInfo).values(contactInfo);
      
      console.log('✓ Added contact info');
    } else {
      console.log(`Contact info already exists`);
    }

    // Check if about page already exists
    const existingAboutPage = await db.select().from(schema.aboutPage);
    
    if (existingAboutPage.length === 0) {
      console.log('Adding about page...');
      
      const aboutPage = {
        titleME: 'O Nama',
        titleEN: 'About Us',
        contentME: 'Brain Box je vodeća kompanija specijalizovana za kreiranje premium poklon paketa i korporativnih poklona u Crnoj Gori. Sa godinama iskustva u industriji, naša misija je da pružimo jedinstvene i personalizovane poklon rešenja koja će ostaviti trajan utisak na vaše partnere, klijente i zaposlene.\n\nNaši paketi kombinuju pažljivo odabrane premium proizvode sa elegantnim pakovanjem i mogućnošću potpune personalizacije prema vašim potrebama. Bilo da tražite novogodišnje pakete ili korporativne poklone, garantujemo kvalitet i profesionalnost u svakom detalju.',
        contentEN: 'Brain Box is a leading company specialized in creating premium gift packages and corporate gifts in Montenegro. With years of experience in the industry, our mission is to provide unique and personalized gift solutions that will leave a lasting impression on your partners, clients, and employees.\n\nOur packages combine carefully selected premium products with elegant packaging and the possibility of complete personalization according to your needs. Whether you are looking for New Year packages or corporate gifts, we guarantee quality and professionalism in every detail.',
        missionME: 'Naša misija je da kreiramo nezaboravne poklon iskustva koja reflektuju vrednosti vaše kompanije i jačaju poslovne odnose.',
        missionEN: 'Our mission is to create unforgettable gift experiences that reflect your company\'s values and strengthen business relationships.',
        visionME: 'Želimo da postanemo regionalni lider u premium poklon pakovanjima, poznati po kreativnosti, kvalitetu i izvrsnoj usluzi.',
        visionEN: 'We aim to become a regional leader in premium gift packaging, known for creativity, quality, and excellent service.',
        image: ''
      };

      await db.insert(schema.aboutPage).values(aboutPage);
      
      console.log('✓ Added about page');
    } else {
      console.log(`About page already exists`);
    }

    console.log('\n✓ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedContent();
