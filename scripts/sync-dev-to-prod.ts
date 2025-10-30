/**
 * Sync Data from Development to Production Database
 * This script reads from Development DB and writes to Production DB.
 * 
 * Usage: tsx scripts/sync-dev-to-prod.ts
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

async function syncDevToProduction() {
  console.log('🚀 Syncing Development → Production Database...\n');
  
  const DEV_DB_URL = process.env.DATABASE_URL;
  const PROD_DB_URL = process.env.PROD_DATABASE_URL;
  
  if (!DEV_DB_URL) {
    console.error('❌ DATABASE_URL (development) not found');
    process.exit(1);
  }
  
  if (!PROD_DB_URL) {
    console.error('❌ PROD_DATABASE_URL not found');
    console.log('\n💡 Set it using:');
    console.log('   export PROD_DATABASE_URL="postgresql://..."');
    process.exit(1);
  }

  console.log('📍 Source (Development):', DEV_DB_URL.substring(0, 40) + '...');
  console.log('📍 Target (Production):', PROD_DB_URL.substring(0, 40) + '...\n');
  
  const devSql = neon(DEV_DB_URL);
  const prodSql = neon(PROD_DB_URL);
  
  const devDb = drizzle(devSql, { schema });
  const prodDb = drizzle(prodSql, { schema });

  try {
    // 1. Copy Users
    console.log('👥 Copying users...');
    const users = await devDb.select().from(schema.users);
    if (users.length > 0) {
      for (const user of users) {
        await prodDb.insert(schema.users).values(user).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${users.length} user(s)`);
    } else {
      console.log('   ⚠️  No users to copy');
    }

    // 2. Copy Package Categories
    console.log('📁 Copying package categories...');
    const categories = await devDb.select().from(schema.packageCategories);
    if (categories.length > 0) {
      for (const category of categories) {
        await prodDb.insert(schema.packageCategories).values(category).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('   ⚠️  No categories to copy');
    }

    // 3. Copy Packages
    console.log('📦 Copying packages...');
    const packages = await devDb.select().from(schema.packages);
    if (packages.length > 0) {
      for (const pkg of packages) {
        await prodDb.insert(schema.packages).values(pkg).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${packages.length} package(s)`);
    } else {
      console.log('   ⚠️  No packages to copy');
    }

    // 4. Copy Package Products
    console.log('🎁 Copying package products...');
    const products = await devDb.select().from(schema.packageProducts);
    if (products.length > 0) {
      for (const product of products) {
        await prodDb.insert(schema.packageProducts).values(product).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${products.length} product(s)`);
    } else {
      console.log('   ⚠️  No products to copy');
    }

    // 5. Copy Hero Slides
    console.log('🎨 Copying hero slides...');
    const heroSlides = await devDb.select().from(schema.heroSlides);
    if (heroSlides.length > 0) {
      for (const slide of heroSlides) {
        await prodDb.insert(schema.heroSlides).values(slide).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${heroSlides.length} hero slide(s)`);
    } else {
      console.log('   ⚠️  No hero slides to copy');
    }

    // 6. Copy Menu Items
    console.log('🧭 Copying menu items...');
    const menuItems = await devDb.select().from(schema.menuItems);
    if (menuItems.length > 0) {
      for (const item of menuItems) {
        await prodDb.insert(schema.menuItems).values(item).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${menuItems.length} menu item(s)`);
    } else {
      console.log('   ⚠️  No menu items to copy');
    }

    // 7. Copy Contact Info (singleton - replace)
    console.log('📞 Copying contact info...');
    const contactInfo = await devDb.select().from(schema.contactInfo);
    if (contactInfo.length > 0) {
      await prodDb.delete(schema.contactInfo);
      await prodDb.insert(schema.contactInfo).values(contactInfo[0]);
      console.log('   ✅ Copied contact info');
    } else {
      console.log('   ⚠️  No contact info to copy');
    }

    // 8. Copy About Page (singleton - replace)
    console.log('📄 Copying about page...');
    const aboutPage = await devDb.select().from(schema.aboutPage);
    if (aboutPage.length > 0) {
      await prodDb.delete(schema.aboutPage);
      await prodDb.insert(schema.aboutPage).values(aboutPage[0]);
      console.log('   ✅ Copied about page');
    } else {
      console.log('   ⚠️  No about page to copy');
    }

    // 9. Copy Custom Package Section (singleton - replace)
    console.log('📦 Copying custom package section...');
    const customSection = await devDb.select().from(schema.customPackageSection);
    if (customSection.length > 0) {
      await prodDb.delete(schema.customPackageSection);
      await prodDb.insert(schema.customPackageSection).values(customSection[0]);
      console.log('   ✅ Copied custom package section');
    } else {
      console.log('   ⚠️  No custom package section to copy');
    }

    // 10. Copy Newsletter Subscribers
    console.log('📧 Copying newsletter subscribers...');
    const subscribers = await devDb.select().from(schema.newsletterSubscribers);
    if (subscribers.length > 0) {
      for (const subscriber of subscribers) {
        await prodDb.insert(schema.newsletterSubscribers).values(subscriber).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${subscribers.length} subscriber(s)`);
    } else {
      console.log('   ⚠️  No subscribers to copy');
    }

    // 11. Copy Inquiries
    console.log('💬 Copying inquiries...');
    const inquiries = await devDb.select().from(schema.inquiries);
    if (inquiries.length > 0) {
      for (const inquiry of inquiries) {
        await prodDb.insert(schema.inquiries).values(inquiry).onConflictDoNothing();
      }
      console.log(`   ✅ Copied ${inquiries.length} inquir${inquiries.length === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('   ⚠️  No inquiries to copy');
    }

    console.log('\n🎉 SUCCESS! All data synced from Development to Production!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Packages: ${packages.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Hero Slides: ${heroSlides.length}`);
    console.log(`   - Menu Items: ${menuItems.length}`);
    console.log(`   - Contact Info: ${contactInfo.length > 0 ? '✓' : '✗'}`);
    console.log(`   - About Page: ${aboutPage.length > 0 ? '✓' : '✗'}`);
    console.log(`   - Custom Section: ${customSection.length > 0 ? '✓' : '✗'}`);
    console.log(`   - Subscribers: ${subscribers.length}`);
    console.log(`   - Inquiries: ${inquiries.length}`);
    
  } catch (error) {
    console.error('\n❌ Error syncing data:', error);
    process.exit(1);
  }
}

syncDevToProduction().catch(console.error);
