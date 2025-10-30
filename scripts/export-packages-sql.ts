import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';

async function exportPackagesSQL() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log('📦 Exporting packages and products as SQL...\n');
  
  const packages = await sql`SELECT * FROM packages ORDER BY created_at`;
  const products = await sql`SELECT * FROM package_products ORDER BY package_id, sort_order`;
  
  let output = `-- Brain Box Package Export
-- Generated: ${new Date().toISOString()}
-- Packages: ${packages.length}
-- Products: ${products.length}

BEGIN;

-- Insert Packages
`;

  for (const pkg of packages) {
    const values = [
      `'${pkg.id}'`,
      `'${(pkg.name_me || '').replace(/'/g, "''")}'`,
      `'${(pkg.name_en || '').replace(/'/g, "''")}'`,
      pkg.price,
      pkg.min_order,
      `'${pkg.category}'`,
      `'${pkg.image}'`,
      pkg.is_featured || 0,
      pkg.featured_order ? `${pkg.featured_order}` : 'NULL',
      `'${new Date(pkg.created_at).toISOString()}'`,
      `'${new Date(pkg.updated_at).toISOString()}'`
    ];
    
    output += `INSERT INTO packages (id, name_me, name_en, price, min_order, category, image, is_featured, featured_order, created_at, updated_at) VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }
  
  output += `\n-- Insert Package Products\n`;
  
  for (const product of products) {
    const images = product.images ? `'${JSON.stringify(product.images).replace(/'/g, "''")}'` : 'NULL';
    const values = [
      `'${product.id}'`,
      `'${product.package_id}'`,
      `'${(product.name_me || '').replace(/'/g, "''")}'`,
      `'${(product.name_en || '').replace(/'/g, "''")}'`,
      `'${(product.description_me || '').replace(/'/g, "''")}'`,
      `'${(product.description_en || '').replace(/'/g, "''")}'`,
      product.specs_me ? `'${product.specs_me.replace(/'/g, "''")}'` : 'NULL',
      product.specs_en ? `'${product.specs_en.replace(/'/g, "''")}'` : 'NULL',
      images,
      product.sort_order
    ];
    
    output += `INSERT INTO package_products (id, package_id, name_me, name_en, description_me, description_en, specs_me, specs_en, images, sort_order) VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }
  
  output += `\nCOMMIT;\n`;
  
  await fs.writeFile('packages-export.sql', output);
  
  console.log('✅ Export complete!');
  console.log('📄 File: packages-export.sql');
  console.log(`📦 ${packages.length} packages`);
  console.log(`🔧 ${products.length} products\n`);
  console.log('📋 To import into Production:');
  console.log('   1. Open Database → Production Database → Editor');
  console.log('   2. Copy contents of packages-export.sql');
  console.log('   3. Paste and click "Run"\n');
}

exportPackagesSQL().catch(console.error);
