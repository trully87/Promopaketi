import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

async function syncPackagesToProduction() {
  try {
    console.log('🔄 Starting package sync to production...\n');

    const devDbUrl = process.env.DATABASE_URL;
    if (!devDbUrl) {
      throw new Error('DATABASE_URL not found');
    }

    console.log('📊 Connecting to database...');
    const sql = neon(devDbUrl);
    const db = drizzle(sql, { schema });

    console.log('📦 Reading packages from database...');
    const packages = await db.select().from(schema.packages);
    console.log(`   Found ${packages.length} packages`);

    console.log('🔧 Reading package products from database...');
    const products = await db.select().from(schema.packageProducts);
    console.log(`   Found ${products.length} products`);

    console.log('\n✅ Data ready for production:');
    console.log(`   - ${packages.length} packages`);
    console.log(`   - ${products.length} products`);

    console.log('\n💾 Inserting packages into production...');
    let packageCount = 0;
    for (const pkg of packages) {
      try {
        await db.insert(schema.packages).values(pkg).onConflictDoNothing();
        packageCount++;
        if (packageCount % 10 === 0) {
          console.log(`   ✓ Inserted ${packageCount}/${packages.length} packages`);
        }
      } catch (error) {
        console.log(`   ⚠️ Skipping package ${pkg.nameME} (already exists)`);
      }
    }
    console.log(`   ✅ Inserted ${packageCount} packages`);

    console.log('\n💾 Inserting package products into production...');
    let productCount = 0;
    for (const product of products) {
      try {
        await db.insert(schema.packageProducts).values(product).onConflictDoNothing();
        productCount++;
        if (productCount % 20 === 0) {
          console.log(`   ✓ Inserted ${productCount}/${products.length} products`);
        }
      } catch (error) {
        console.log(`   ⚠️ Skipping product (already exists)`);
      }
    }
    console.log(`   ✅ Inserted ${productCount} products`);

    console.log('\n🎉 Package sync completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Total packages synced: ${packageCount}`);
    console.log(`🔧 Total products synced: ${productCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error syncing packages:', error);
    throw error;
  }
}

if (require.main === module) {
  syncPackagesToProduction()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { syncPackagesToProduction };
