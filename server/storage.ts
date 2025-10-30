import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, sql as dsql, desc, asc, and, gte, lte, or, ilike } from 'drizzle-orm';
import * as schema from '@shared/schema';
import type { 
  User, InsertUser, 
  Package, InsertPackage,
  PackageProduct, InsertPackageProduct,
  Inquiry, InsertInquiry,
  HeroSlide, InsertHeroSlide,
  MenuItem, InsertMenuItem,
  ContactInfo, InsertContactInfo,
  AboutPage, InsertAboutPage,
  NewsletterSubscriber, InsertNewsletterSubscriber,
  PackageCategory, InsertPackageCategory
} from '@shared/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export interface PaginationOptions {
  category?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Package methods
  getAllPackages(): Promise<Package[]>;
  getPackages(options: PaginationOptions): Promise<PaginatedResult<Package>>;
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

  // Contact info methods (singleton - only one row)
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(id: string, info: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
  createContactInfo(info: InsertContactInfo): Promise<ContactInfo>;

  // About page methods (singleton - only one row)
  getAboutPage(): Promise<AboutPage | undefined>;
  updateAboutPage(id: string, page: Partial<InsertAboutPage>): Promise<AboutPage | undefined>;
  createAboutPage(page: InsertAboutPage): Promise<AboutPage>;

  // Newsletter subscriber methods
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;

  // Package category methods
  getAllPackageCategories(): Promise<PackageCategory[]>;
  getAllPackageCategoriesForAdmin(): Promise<PackageCategory[]>;
  getPackageCategory(id: string): Promise<PackageCategory | undefined>;
  createPackageCategory(category: InsertPackageCategory): Promise<PackageCategory>;
  updatePackageCategory(id: string, category: Partial<InsertPackageCategory>): Promise<PackageCategory | undefined>;
  deletePackageCategory(id: string): Promise<boolean>;
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

  async getPackages(options: PaginationOptions): Promise<PaginatedResult<Package>> {
    const { category, page, pageSize, sortBy = 'createdAt', sortOrder = 'desc', minPrice, maxPrice, search } = options;
    
    // Build WHERE clauses array
    const whereClauses: any[] = [];
    
    // Category filter
    if (category) {
      whereClauses.push(eq(schema.packages.category, category));
    }
    
    // Price range filters
    if (minPrice !== undefined && minPrice !== null) {
      whereClauses.push(gte(schema.packages.price, minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      whereClauses.push(lte(schema.packages.price, maxPrice));
    }
    
    // Search filter (searches in both ME and EN names)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push(
        or(
          ilike(schema.packages.nameME, searchTerm),
          ilike(schema.packages.nameEN, searchTerm)
        )
      );
    }
    
    // Combine WHERE clauses using and()
    const whereClause = whereClauses.length > 0 ? and(...whereClauses) : undefined;
    
    // Get total count for pagination using SQL COUNT
    const countQuery = db
      .select({ count: dsql<number>`count(*)::int` })
      .from(schema.packages);
    
    const countResult = whereClause 
      ? await countQuery.where(whereClause)
      : await countQuery;
    
    const total = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / pageSize);
    
    // Build data query with sorting
    let sortColumn;
    if (sortBy === 'price') {
      sortColumn = schema.packages.price;
    } else if (sortBy === 'name') {
      sortColumn = schema.packages.nameME; // Sort by ME name (can be changed to EN if needed)
    } else {
      sortColumn = schema.packages.createdAt;
    }
    
    const orderByClause = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
    
    // Apply pagination using SQL offset and limit
    const offset = (page - 1) * pageSize;
    const dataQuery = db
      .select()
      .from(schema.packages)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);
    
    const data = whereClause 
      ? await dataQuery.where(whereClause)
      : await dataQuery;
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
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

  // Contact info methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const info = await db.select().from(schema.contactInfo).limit(1);
    return info[0];
  }

  async updateContactInfo(id: string, info: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const updated = await db
      .update(schema.contactInfo)
      .set({ ...info, updatedAt: new Date() })
      .where(eq(schema.contactInfo.id, id))
      .returning();
    return updated[0];
  }

  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const created = await db.insert(schema.contactInfo).values(info).returning();
    return created[0];
  }

  // About page methods
  async getAboutPage(): Promise<AboutPage | undefined> {
    const page = await db.select().from(schema.aboutPage).limit(1);
    return page[0];
  }

  async updateAboutPage(id: string, page: Partial<InsertAboutPage>): Promise<AboutPage | undefined> {
    const updated = await db
      .update(schema.aboutPage)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(schema.aboutPage.id, id))
      .returning();
    return updated[0];
  }

  async createAboutPage(page: InsertAboutPage): Promise<AboutPage> {
    const created = await db.insert(schema.aboutPage).values(page).returning();
    return created[0];
  }

  // Newsletter subscriber methods
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(schema.newsletterSubscribers);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const created = await db.insert(schema.newsletterSubscribers).values(subscriber).returning();
    return created[0];
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const subscriber = await db
      .select()
      .from(schema.newsletterSubscribers)
      .where(eq(schema.newsletterSubscribers.email, email));
    return subscriber[0];
  }

  // Package category methods
  async getAllPackageCategories(): Promise<PackageCategory[]> {
    return await db
      .select()
      .from(schema.packageCategories)
      .where(eq(schema.packageCategories.isActive, 1))
      .orderBy(schema.packageCategories.sortOrder);
  }

  async getAllPackageCategoriesForAdmin(): Promise<PackageCategory[]> {
    return await db
      .select()
      .from(schema.packageCategories)
      .orderBy(schema.packageCategories.sortOrder);
  }

  async getPackageCategory(id: string): Promise<PackageCategory | undefined> {
    const categories = await db
      .select()
      .from(schema.packageCategories)
      .where(eq(schema.packageCategories.id, id));
    return categories[0];
  }

  async createPackageCategory(category: InsertPackageCategory): Promise<PackageCategory> {
    const created = await db.insert(schema.packageCategories).values(category).returning();
    return created[0];
  }

  async updatePackageCategory(id: string, category: Partial<InsertPackageCategory>): Promise<PackageCategory | undefined> {
    const updated = await db
      .update(schema.packageCategories)
      .set(category)
      .where(eq(schema.packageCategories.id, id))
      .returning();
    return updated[0];
  }

  async deletePackageCategory(id: string): Promise<boolean> {
    const result = await db.delete(schema.packageCategories).where(eq(schema.packageCategories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
