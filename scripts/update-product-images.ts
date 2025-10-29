import { db } from '../server/storage';
import { packageProducts, packages as packagesTable } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// Mapping of product names to their images
const productImageMap: Record<string, string[]> = {
  // Keramička Šolja / Ceramic Mug
  'Keramička Šolja': ['/attached_assets/generated_images/Ceramic_mug_product_shot_17d03128.png'],
  'Ceramic Mug': ['/attached_assets/generated_images/Ceramic_mug_product_shot_17d03128.png'],
  
  // Organsko Domaće Med / Organic Local Honey
  'Organsko Domaće Med': ['/attached_assets/generated_images/Organic_honey_jar_2e2f94af.png'],
  'Organic Local Honey': ['/attached_assets/generated_images/Organic_honey_jar_2e2f94af.png'],
  
  // Platnena Kesica Čaja / Linen Tea Bag
  'Platnena Kesica Čaja': ['/attached_assets/generated_images/Linen_tea_bag_b8e1ff0e.png'],
  'Linen Tea Bag': ['/attached_assets/generated_images/Linen_tea_bag_b8e1ff0e.png'],
  
  // Drvena Kašičica / Wooden Spoon
  'Drvena Kašičica': ['/attached_assets/generated_images/Wooden_spoon_product_photo_e840ea3d.png'],
  'Wooden Spoon': ['/attached_assets/generated_images/Wooden_spoon_product_photo_e840ea3d.png'],
  
  // Novogodišnja Čestitka / New Year's Greeting Card
  'Novogodišnja Čestitka': ['/attached_assets/generated_images/New_Year_greeting_card_b4108559.png'],
  "New Year's Greeting Card": ['/attached_assets/generated_images/New_Year_greeting_card_b4108559.png'],
  
  // Custom Made Kutija / Custom Made Box
  'Custom Made Kutija': ['/attached_assets/generated_images/Custom_gift_box_packaging_e3a3e268.png'],
  'Custom Made Box': ['/attached_assets/generated_images/Custom_gift_box_packaging_e3a3e268.png'],
  
  // Ćebe od Flisa / Fleece Blanket
  'Ćebe od Flisa': ['/attached_assets/generated_images/Fleece_blanket_product_de9569d0.png'],
  'Fleece Blanket': ['/attached_assets/generated_images/Fleece_blanket_product_de9569d0.png'],
  
  // Čokolada Montenegrina / Montenegrina Chocolate
  'Čokolada Montenegrina': ['/attached_assets/generated_images/Montenegrina_chocolate_bar_c14f8db1.png'],
  'Montenegrina Chocolate': ['/attached_assets/generated_images/Montenegrina_chocolate_bar_c14f8db1.png'],
  
  // Novogodišnja Svijeća / New Year's Candle
  'Novogodišnja Svijeća': ['/attached_assets/generated_images/New_Year_decorative_candle_622f5405.png'],
  "New Year's Candle": ['/attached_assets/generated_images/New_Year_decorative_candle_622f5405.png'],
  
  // Termos / Thermos
  'Termos': ['/attached_assets/generated_images/Thermos_bottle_product_54b5c10d.png'],
  'Thermos': ['/attached_assets/generated_images/Thermos_bottle_product_54b5c10d.png'],
  
  // Pljoska / Hip Flask
  'Pljoska': ['/attached_assets/generated_images/Metal_hip_flask_product_b904b9c1.png'],
  'Hip Flask': ['/attached_assets/generated_images/Metal_hip_flask_product_b904b9c1.png'],
  
  // Premium Maslinovo Ulje / Premium Olive Oil
  'Premium Maslinovo Ulje': ['/attached_assets/generated_images/Olive_oil_bottle_7f47628c.png'],
  'Premium Olive Oil': ['/attached_assets/generated_images/Olive_oil_bottle_7f47628c.png'],
  
  // Privjezak / Keychain
  'Privjezak': ['/attached_assets/generated_images/Metal_keychain_product_7a561612.png'],
  'Keychain': ['/attached_assets/generated_images/Metal_keychain_product_7a561612.png'],
  
  // Vakumirane Masline / Vacuum Packed Olives
  'Vakumirane Masline': ['/attached_assets/generated_images/Vacuum_packed_olives_c81b2924.png'],
  'Vacuum Packed Olives': ['/attached_assets/generated_images/Vacuum_packed_olives_c81b2924.png'],
  
  // Orašasto Voće / Organic Nuts
  'Orašasto Voće': ['/attached_assets/generated_images/Organic_nuts_in_linen_bag_bcb0dee8.png'],
  'Organic Nuts': ['/attached_assets/generated_images/Organic_nuts_in_linen_bag_bcb0dee8.png'],
  
  // A5 Notes / A5 Notebook
  'A5 Notes': ['/attached_assets/generated_images/A5_notebook_product_5158505c.png'],
  'A5 Notebook': ['/attached_assets/generated_images/A5_notebook_product_5158505c.png'],
  
  // Metalna Hemijska Olovka / Metal Pen
  'Metalna Hemijska Olovka': ['/attached_assets/generated_images/Metal_pen_product_338ae787.png'],
  'Metal Pen': ['/attached_assets/generated_images/Metal_pen_product_338ae787.png'],
  
  // Boca za Vodu / Water Bottle
  'Boca za Vodu': ['/attached_assets/generated_images/Sports_water_bottle_3562263e.png'],
  'Water Bottle': ['/attached_assets/generated_images/Sports_water_bottle_3562263e.png'],
  
  // Metalni Privezak / Metal Keychain
  'Metalni Privezak': ['/attached_assets/generated_images/Metal_keychain_product_7a561612.png'],
  'Metal Keychain': ['/attached_assets/generated_images/Metal_keychain_product_7a561612.png'],
  
  // Kesa - Pakovanje / Bag Packaging
  'Kesa - Pakovanje': ['/attached_assets/generated_images/Branded_tote_bag_packaging_edfcd140.png'],
  'Bag Packaging': ['/attached_assets/generated_images/Branded_tote_bag_packaging_edfcd140.png'],
  
  // Powerbank 5000mAh
  'Powerbank 5000mAh': ['/attached_assets/generated_images/Powerbank_5000mAh_94fdd631.png'],
  
  // 3-in-1 Wireless Charger
  '3-in-1 Wireless Charger': ['/attached_assets/generated_images/Wireless_charger_3-in-1_136478c9.png'],
  
  // Prenosivi 3W Zvučnik / Portable 3W Speaker
  'Prenosivi 3W Zvučnik': ['/attached_assets/generated_images/Bluetooth_speaker_3W_dade6bac.png'],
  'Portable 3W Speaker': ['/attached_assets/generated_images/Bluetooth_speaker_3W_dade6bac.png'],
  
  // Čestitka / Greeting Card
  'Čestitka': ['/attached_assets/generated_images/New_Year_greeting_card_b4108559.png'],
  'Greeting Card': ['/attached_assets/generated_images/New_Year_greeting_card_b4108559.png'],
  
  // A5 Notes od Šećerne Trske / A5 Sugarcane Notebook
  'A5 Notes od Šećerne Trske': ['/attached_assets/generated_images/Sugarcane_A5_notebook_b01b0134.png'],
  'A5 Sugarcane Notebook': ['/attached_assets/generated_images/Sugarcane_A5_notebook_b01b0134.png'],
  
  // Olovka od Pluta / Cork Pen
  'Olovka od Pluta': ['/attached_assets/generated_images/Cork_and_wheat_pen_05f8ce0f.png'],
  'Cork Pen': ['/attached_assets/generated_images/Cork_and_wheat_pen_05f8ce0f.png'],
  
  // Termos od Bambusa / Bamboo Thermos
  'Termos od Bambusa': ['/attached_assets/generated_images/Bamboo_thermos_eco_e0dd08e1.png'],
  'Bamboo Thermos': ['/attached_assets/generated_images/Bamboo_thermos_eco_e0dd08e1.png'],
  
  // Drveni Privezak / Wooden Keychain
  'Drveni Privezak': ['/attached_assets/generated_images/Wooden_keychain_with_UV_print_d2e893de.png'],
  'Wooden Keychain': ['/attached_assets/generated_images/Wooden_keychain_with_UV_print_d2e893de.png'],
};

async function updateProductImages() {
  console.log('🖼️  Starting to update product images...');
  
  try {
    // Get all products
    const allProducts = await db.select().from(packageProducts);
    console.log(`Found ${allProducts.length} products in database`);
    
    let updatedCount = 0;
    
    for (const product of allProducts) {
      // Try to find images for this product based on its name
      const imagesME = productImageMap[product.nameME];
      const imagesEN = productImageMap[product.nameEN];
      
      const images = imagesME || imagesEN;
      
      if (images && images.length > 0) {
        await db
          .update(packageProducts)
          .set({ images })
          .where(eq(packageProducts.id, product.id));
        
        console.log(`✅ Updated "${product.nameME}" with ${images.length} image(s)`);
        updatedCount++;
      } else {
        console.log(`⚠️  No images found for "${product.nameME}" / "${product.nameEN}"`);
      }
    }
    
    console.log(`\n✨ Updated ${updatedCount} out of ${allProducts.length} products with images`);
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
    throw error;
  }
}

updateProductImages()
  .then(() => {
    console.log('\n🎉 Image update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Image update failed:', error);
    process.exit(1);
  });
