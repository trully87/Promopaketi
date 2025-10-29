import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { 
  insertPackageSchema, 
  insertPackageProductSchema, 
  insertInquirySchema,
  insertHeroSlideSchema,
  insertMenuItemSchema,
  insertContactInfoSchema,
  insertAboutPageSchema,
  insertNewsletterSubscriberSchema
} from "@shared/schema";
import { requireAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import http from "http";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export function registerRoutes(app: Express): http.Server {
  const server = http.createServer(app);
  
  // Serve attached assets (generated images)
  const attachedAssetsDir = path.join(process.cwd(), "attached_assets");
  app.use("/attached_assets", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }, (req, res, next) => {
    // Decode URI to handle spaces and special characters
    const decodedPath = decodeURIComponent(req.path);
    
    // Sanitize path to prevent path traversal
    const normalizedPath = path.normalize(decodedPath);
    if (normalizedPath.includes('..')) {
      return res.status(400).json({ error: "Invalid path" });
    }
    
    const filePath = path.join(attachedAssetsDir, normalizedPath);
    
    // Ensure the resolved path is still within attachedAssetsDir
    if (!filePath.startsWith(attachedAssetsDir)) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });
  
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }, (req, res, next) => {
    // Sanitize filename to prevent path traversal
    const filename = path.basename(req.path);
    if (!filename || filename.includes('..')) {
      return res.status(400).json({ error: "Invalid filename" });
    }
    
    const filePath = path.join(uploadDir, filename);
    
    // Ensure the resolved path is still within uploadDir
    if (!filePath.startsWith(uploadDir)) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // Upload endpoint (protected)
  app.post("/api/upload", requireAuth, upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // Package routes
  app.get("/api/packages", async (req: Request, res: Response) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/:id", async (req: Request, res: Response) => {
    try {
      const pkg = await storage.getPackage(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  });

  app.post("/api/packages", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(validated);
      res.status(201).json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Invalid package data", details: error });
    }
  });

  app.patch("/api/packages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, validated);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Invalid package data", details: error });
    }
  });

  app.delete("/api/packages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deletePackage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete package" });
    }
  });

  // Package products routes
  app.get("/api/packages/:packageId/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getPackageProducts(req.params.packageId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/packages/:packageId/products", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertPackageProductSchema.parse({
        ...req.body,
        packageId: req.params.packageId,
      });
      const product = await storage.createPackageProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data", details: error });
    }
  });

  app.patch("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertPackageProductSchema.partial().parse(req.body);
      const product = await storage.updatePackageProduct(req.params.id, validated);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data", details: error });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deletePackageProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req: Request, res: Response) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "Invalid inquiry data", details: error });
    }
  });

  app.get("/api/inquiries", requireAuth, async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Hero slides routes
  app.get("/api/hero-slides", async (req: Request, res: Response) => {
    try {
      const slides = await storage.getAllHeroSlides();
      res.json(slides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero slides" });
    }
  });

  app.get("/api/admin/hero-slides", requireAuth, async (req: Request, res: Response) => {
    try {
      const slides = await storage.getAllHeroSlidesForAdmin();
      res.json(slides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero slides" });
    }
  });

  app.get("/api/hero-slides/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const slide = await storage.getHeroSlide(req.params.id);
      if (!slide) {
        return res.status(404).json({ error: "Hero slide not found" });
      }
      res.json(slide);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero slide" });
    }
  });

  app.post("/api/hero-slides", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.createHeroSlide(validated);
      res.status(201).json(slide);
    } catch (error) {
      res.status(400).json({ error: "Invalid hero slide data", details: error });
    }
  });

  app.patch("/api/hero-slides/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertHeroSlideSchema.partial().parse(req.body);
      const slide = await storage.updateHeroSlide(req.params.id, validated);
      if (!slide) {
        return res.status(404).json({ error: "Hero slide not found" });
      }
      res.json(slide);
    } catch (error) {
      res.status(400).json({ error: "Invalid hero slide data", details: error });
    }
  });

  app.delete("/api/hero-slides/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteHeroSlide(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Hero slide not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete hero slide" });
    }
  });

  // Menu items routes
  app.get("/api/menu-items", async (req: Request, res: Response) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/admin/menu-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const items = await storage.getAllMenuItemsForAdmin();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data", details: error });
    }
  });

  app.patch("/api/menu-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(req.params.id, validated);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data", details: error });
    }
  });

  app.delete("/api/menu-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteMenuItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // Contact info routes
  app.get("/api/contact-info", async (req: Request, res: Response) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.get("/api/admin/contact-info", requireAuth, async (req: Request, res: Response) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact info" });
    }
  });

  app.patch("/api/admin/contact-info/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertContactInfoSchema.partial().parse(req.body);
      const info = await storage.updateContactInfo(req.params.id, validated);
      if (!info) {
        return res.status(404).json({ error: "Contact info not found" });
      }
      res.json(info);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact info data", details: error });
    }
  });

  // About page routes
  app.get("/api/about", async (req: Request, res: Response) => {
    try {
      const page = await storage.getAboutPage();
      res.json(page || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch about page" });
    }
  });

  app.get("/api/admin/about", requireAuth, async (req: Request, res: Response) => {
    try {
      const page = await storage.getAboutPage();
      res.json(page || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch about page" });
    }
  });

  app.patch("/api/admin/about/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertAboutPageSchema.partial().parse(req.body);
      const page = await storage.updateAboutPage(req.params.id, validated);
      if (!page) {
        return res.status(404).json({ error: "About page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Invalid about page data", details: error });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const validated = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterSubscriberByEmail(validated.email);
      if (existing) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validated);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscriber data", details: error });
    }
  });

  app.get("/api/admin/newsletter-subscribers", requireAuth, async (req: Request, res: Response) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch newsletter subscribers" });
    }
  });

  return server;
}
