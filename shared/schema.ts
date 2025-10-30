import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Packages table
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameME: text("name_me").notNull(),
  nameEN: text("name_en").notNull(),
  price: integer("price").notNull(),
  minOrder: integer("min_order").notNull().default(30),
  category: text("category").notNull(), // 'newyear' or 'corporate'
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

// Package products (individual items within a package)
export const packageProducts = pgTable("package_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").notNull().references(() => packages.id, { onDelete: 'cascade' }),
  nameME: text("name_me").notNull(),
  nameEN: text("name_en").notNull(),
  descriptionME: text("description_me").notNull(),
  descriptionEN: text("description_en").notNull(),
  specsME: text("specs_me"),
  specsEN: text("specs_en"),
  images: jsonb("images").$type<string[]>().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPackageProductSchema = createInsertSchema(packageProducts).omit({
  id: true,
});

export type InsertPackageProduct = z.infer<typeof insertPackageProductSchema>;
export type PackageProduct = typeof packageProducts.$inferSelect;

// Contact inquiries
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  packageType: text("package_type"),
  quantity: text("quantity"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

// Hero slides for homepage carousel
export const heroSlides = pgTable("hero_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleME: text("title_me").notNull(),
  titleEN: text("title_en").notNull(),
  subtitleME: text("subtitle_me").notNull(),
  subtitleEN: text("subtitle_en").notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 1 = active, 0 = inactive
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
});

export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlides.$inferSelect;

// Menu items for navigation
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelME: text("label_me").notNull(),
  labelEN: text("label_en").notNull(),
  path: text("path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 1 = active, 0 = inactive
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Contact information (singleton - only one row)
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  viber: text("viber"),
  addressME: text("address_me"),
  addressEN: text("address_en"),
  mapLatitude: text("map_latitude"),
  mapLongitude: text("map_longitude"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

// About page content (singleton - only one row)
export const aboutPage = pgTable("about_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleME: text("title_me").notNull(),
  titleEN: text("title_en").notNull(),
  contentME: text("content_me").notNull(),
  contentEN: text("content_en").notNull(),
  missionME: text("mission_me"),
  missionEN: text("mission_en"),
  visionME: text("vision_me"),
  visionEN: text("vision_en"),
  image: text("image"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAboutPageSchema = createInsertSchema(aboutPage).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutPage = z.infer<typeof insertAboutPageSchema>;
export type AboutPage = typeof aboutPage.$inferSelect;

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default('active'), // 'active' or 'unsubscribed'
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Package categories for dynamic category management
export const packageCategories = pgTable("package_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelME: text("label_me").notNull(),
  labelEN: text("label_en").notNull(),
  value: text("value").notNull().unique(), // unique identifier used in packages.category
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageCategorySchema = createInsertSchema(packageCategories).omit({
  id: true,
  createdAt: true,
});

export type InsertPackageCategory = z.infer<typeof insertPackageCategorySchema>;
export type PackageCategory = typeof packageCategories.$inferSelect;

// Custom Package Section for homepage (singleton - only one row)
export const customPackageSection = pgTable("custom_package_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleME: text("title_me").notNull(),
  titleEN: text("title_en").notNull(),
  descriptionME: text("description_me").notNull(),
  descriptionEN: text("description_en").notNull(),
  ctaTextME: text("cta_text_me").notNull(),
  ctaTextEN: text("cta_text_en").notNull(),
  image: text("image").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomPackageSectionSchema = createInsertSchema(customPackageSection).omit({
  id: true,
  updatedAt: true,
});

export type InsertCustomPackageSection = z.infer<typeof insertCustomPackageSectionSchema>;
export type CustomPackageSection = typeof customPackageSection.$inferSelect;
