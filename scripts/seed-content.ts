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
          labelME: 'Novogodišnji paketi',
          labelEN: 'New Year Packages',
          path: '#packages',
          sortOrder: 1,
          isActive: 1
        },
        {
          labelME: 'Korporativni paketi',
          labelEN: 'Corporate Packages',
          path: '#packages',
          sortOrder: 2,
          isActive: 1
        },
        {
          labelME: 'Kontakt',
          labelEN: 'Contact',
          path: '#contact',
          sortOrder: 3,
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

    console.log('\n✓ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedContent();
