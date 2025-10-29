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
