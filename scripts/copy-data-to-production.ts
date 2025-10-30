/**
 * Copy Data from Development to Production Database
 * This script copies all data from development database to production database.
 * 
 * Usage: tsx scripts/copy-data-to-production.ts
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

async function copyDataToProduction() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🚀 Copying data from development to production...');
  console.log('📍 Target database:', databaseUrl.substring(0, 30) + '...\n');
  
  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  try {
    // 1. Copy Users (admin accounts)
    console.log('👥 Copying users...');
    const users = await db.select().from(schema.users);
    if (users.length > 0) {
      for (const user of users) {
        await db.insert(schema.users).values(user).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${users.length} user(s)`);
    } else {
      console.log('   ⚠️  No users to copy');
    }

    // 2. Copy Package Categories
    console.log('📁 Copying package categories...');
    const categories = await db.select().from(schema.packageCategories);
    if (categories.length > 0) {
      for (const category of categories) {
        await db.insert(schema.packageCategories).values(category).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('   ⚠️  No categories to copy');
    }

    // 3. Copy Packages
    console.log('📦 Copying packages...');
    const packages = await db.select().from(schema.packages);
    if (packages.length > 0) {
      for (const pkg of packages) {
        await db.insert(schema.packages).values(pkg).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${packages.length} package(s)`);
    } else {
      console.log('   ⚠️  No packages to copy');
    }

    // 4. Copy Package Products
    console.log('🎁 Copying package products...');
    const products = await db.select().from(schema.packageProducts);
    if (products.length > 0) {
      for (const product of products) {
        await db.insert(schema.packageProducts).values(product).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${products.length} product(s)`);
    } else {
      console.log('   ⚠️  No products to copy');
    }

    // 5. Copy Hero Slides
    console.log('🎨 Copying hero slides...');
    const heroSlides = await db.select().from(schema.heroSlides);
    if (heroSlides.length > 0) {
      for (const slide of heroSlides) {
        await db.insert(schema.heroSlides).values(slide).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${heroSlides.length} hero slide(s)`);
    } else {
      console.log('   ⚠️  No hero slides to copy');
    }

    // 6. Copy Menu Items
    console.log('🧭 Copying menu items...');
    const menuItems = await db.select().from(schema.menuItems);
    if (menuItems.length > 0) {
      for (const item of menuItems) {
        await db.insert(schema.menuItems).values(item).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${menuItems.length} menu item(s)`);
    } else {
      console.log('   ⚠️  No menu items to copy');
    }

    // 7. Copy Contact Info
    console.log('📞 Copying contact info...');
    const contactInfo = await db.select().from(schema.contactInfo);
    if (contactInfo.length > 0) {
      // Delete existing contact info first (singleton)
      await db.delete(schema.contactInfo);
      // Insert new one
      await db.insert(schema.contactInfo).values(contactInfo[0]);
      console.log('   ✓ Copied contact info');
    } else {
      console.log('   ⚠️  No contact info to copy');
    }

    // 8. Copy About Page
    console.log('📄 Copying about page...');
    const aboutPage = await db.select().from(schema.aboutPage);
    if (aboutPage.length > 0) {
      // Delete existing about page first (singleton)
      await db.delete(schema.aboutPage);
      // Insert new one
      await db.insert(schema.aboutPage).values(aboutPage[0]);
      console.log('   ✓ Copied about page');
    } else {
      console.log('   ⚠️  No about page to copy');
    }

    // 9. Copy Custom Package Section
    console.log('🎯 Copying custom package section...');
    const customSection = await db.select().from(schema.customPackageSection);
    if (customSection.length > 0) {
      // Delete existing section first (singleton)
      await db.delete(schema.customPackageSection);
      // Insert new one
      await db.insert(schema.customPackageSection).values(customSection[0]);
      console.log('   ✓ Copied custom package section');
    } else {
      console.log('   ⚠️  No custom package section to copy');
    }

    // 10. Copy Newsletter Subscribers
    console.log('📧 Copying newsletter subscribers...');
    const subscribers = await db.select().from(schema.newsletterSubscribers);
    if (subscribers.length > 0) {
      for (const subscriber of subscribers) {
        await db.insert(schema.newsletterSubscribers).values(subscriber).onConflictDoNothing();
      }
      console.log(`   ✓ Copied ${subscribers.length} subscriber(s)`);
    } else {
      console.log('   ⚠️  No subscribers to copy');
    }

    console.log('\n✅ Data copy completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Packages: ${packages.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Hero Slides: ${heroSlides.length}`);
    console.log(`   - Menu Items: ${menuItems.length}`);
    console.log(`   - Newsletter Subscribers: ${subscribers.length}`);
    console.log(`   - Contact Info: ${contactInfo.length > 0 ? '✓' : '✗'}`);
    console.log(`   - About Page: ${aboutPage.length > 0 ? '✓' : '✗'}`);
    console.log(`   - Custom Package Section: ${customSection.length > 0 ? '✓' : '✗'}`);
    console.log('\n🎉 Production database is now populated with data!');
    console.log('⚠️  Note: Inquiries were NOT copied (they are user submissions)');
    
  } catch (error) {
    console.error('\n❌ Copy error:', error);
    throw error;
  }
}

// Run copy
copyDataToProduction()
  .then(() => {
    console.log('\n✨ Copy completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Copy failed:', error);
    process.exit(1);
  });
