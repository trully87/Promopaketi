import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '@shared/schema';
import type { 
  User, InsertUser, 
  Package, InsertPackage,
  PackageProduct, InsertPackageProduct,
  Inquiry, InsertInquiry,
  HeroSlide, InsertHeroSlide,
  MenuItem, InsertMenuItem
} from '@shared/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Package methods
  getAllPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  // Package product methods
  getPackageProducts(packageId: string): Promise<PackageProduct[]>;
  createPackageProduct(product: InsertPackageProduct): Promise<PackageProduct>;
  updatePackageProduct(id: string, product: Partial<InsertPackageProduct>): Promise<PackageProduct | undefined>;
  deletePackageProduct(id: string): Promise<boolean>;

  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;

  // Hero slide methods
  getAllHeroSlides(): Promise<HeroSlide[]>;
  getAllHeroSlidesForAdmin(): Promise<HeroSlide[]>;
  getHeroSlide(id: string): Promise<HeroSlide | undefined>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: string, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: string): Promise<boolean>;

  // Menu item methods
  getAllMenuItems(): Promise<MenuItem[]>;
  getAllMenuItemsForAdmin(): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return users[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await db.insert(schema.users).values(insertUser).returning();
    return users[0];
  }

  // Package methods
  async getAllPackages(): Promise<Package[]> {
    return await db.select().from(schema.packages);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const packages = await db.select().from(schema.packages).where(eq(schema.packages.id, id));
    return packages[0];
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const packages = await db.insert(schema.packages).values(pkg).returning();
    return packages[0];
  }

  async updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const packages = await db
      .update(schema.packages)
      .set({ ...pkg, updatedAt: new Date() })
      .where(eq(schema.packages.id, id))
      .returning();
    return packages[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await db.delete(schema.packages).where(eq(schema.packages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Package product methods
  async getPackageProducts(packageId: string): Promise<PackageProduct[]> {
    return await db
      .select()
      .from(schema.packageProducts)
      .where(eq(schema.packageProducts.packageId, packageId))
      .orderBy(schema.packageProducts.sortOrder);
  }

  async createPackageProduct(product: InsertPackageProduct): Promise<PackageProduct> {
    const products = await db.insert(schema.packageProducts).values(product).returning();
    return products[0];
  }

  async updatePackageProduct(id: string, product: Partial<InsertPackageProduct>): Promise<PackageProduct | undefined> {
    const products = await db
      .update(schema.packageProducts)
      .set(product)
      .where(eq(schema.packageProducts.id, id))
      .returning();
    return products[0];
  }

  async deletePackageProduct(id: string): Promise<boolean> {
    const result = await db.delete(schema.packageProducts).where(eq(schema.packageProducts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Inquiry methods
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const inquiries = await db.insert(schema.inquiries).values(inquiry).returning();
    return inquiries[0];
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(schema.inquiries);
  }

  // Hero slide methods
  async getAllHeroSlides(): Promise<HeroSlide[]> {
    return await db
      .select()
      .from(schema.heroSlides)
      .where(eq(schema.heroSlides.isActive, 1))
      .orderBy(schema.heroSlides.sortOrder);
  }

  async getAllHeroSlidesForAdmin(): Promise<HeroSlide[]> {
    return await db
      .select()
      .from(schema.heroSlides)
      .orderBy(schema.heroSlides.sortOrder);
  }

  async getHeroSlide(id: string): Promise<HeroSlide | undefined> {
    const slides = await db.select().from(schema.heroSlides).where(eq(schema.heroSlides.id, id));
    return slides[0];
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const slides = await db.insert(schema.heroSlides).values(slide).returning();
    return slides[0];
  }

  async updateHeroSlide(id: string, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const slides = await db
      .update(schema.heroSlides)
      .set(slide)
      .where(eq(schema.heroSlides.id, id))
      .returning();
    return slides[0];
  }

  async deleteHeroSlide(id: string): Promise<boolean> {
    const result = await db.delete(schema.heroSlides).where(eq(schema.heroSlides.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Menu item methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.isActive, 1))
      .orderBy(schema.menuItems.sortOrder);
  }

  async getAllMenuItemsForAdmin(): Promise<MenuItem[]> {
    return await db
      .select()
      .from(schema.menuItems)
      .orderBy(schema.menuItems.sortOrder);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const items = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id));
    return items[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const items = await db.insert(schema.menuItems).values(item).returning();
    return items[0];
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const items = await db
      .update(schema.menuItems)
      .set(item)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return items[0];
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
