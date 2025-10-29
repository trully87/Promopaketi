# Brain Box Gift Packages - E-Commerce Platform

## Overview

Brain Box is a premium e-commerce web application specializing in luxury gift packages for the Serbian/Montenegrin market. The platform offers multiple product categories including New Year's (Novogodišnji), Corporate (Korporativni), Eco (Eko), Local Producers (Lokalni Proizvođači), and Premium VIP packages, with full bilingual support (Serbian/Montenegrin and English). The application features a customer-facing storefront for browsing packages and submitting inquiries, alongside a comprehensive admin panel for managing products, categories, content, contact information, About page, and newsletter subscribers.

## Recent Changes (October 29, 2025)

**Premium Design Transformation**
- Implemented comprehensive premium design system with warm cream backgrounds (#FAF8F5), deep charcoal (#1A1A1A), and multi-tier color system (gold, silver, emerald) for package differentiation
- Created sticky navigation with scroll-based shadow transitions, backdrop blur effects, and animated nav link underlines
- Redesigned hero section with Playfair Display serif typography, bespoke CTA buttons with soft-glow effects, and custom animated scroll chevron
- Enhanced package cards with tier-based styling: gold accents for Premium VIP, silver for Corporate, emerald for Eko, and primary red for New Year packages
- Implemented card-lift hover effects, image-zoom animations, and multi-layer premium shadows
- Premium PackageModal redesign with luxury pricing card (gradient background, serif fonts, centered layout) and elegant product list with dividers
- Added micro-interaction utilities (soft-glow-primary, soft-glow-gold, image-zoom, card-lift, animate-bounce-slow) for enhanced user experience

**Navigation & Package Categories Update**
- Refactored navigation to use smooth scroll instead of routing for better UX
- Navigation now displays 3 main package categories + Contact: Novogodišnji Paketi, Korporativni Paketi, Eko Paketi, Kontakt
- Added Eko (Eco) category section to homepage with dedicated CategorySection and package grid
- Implemented scrollToSection function with smooth scroll behavior to section IDs
- Updated translations with Eko category labels (ME: "Eko Paketi", EN: "Eco Packages")
- Fixed package categorization: moved "Eko Održivi Paket" from corporate to eko category

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- Shadcn UI component library (New York style variant) for consistent, accessible components
- Radix UI primitives as the foundation for complex interactive components
- Tailwind CSS for utility-first styling with custom theme configuration
- Premium design system with warm cream backgrounds, deep charcoal text, and multi-tier color hierarchy
- Custom micro-interaction utilities: soft-glow hover states, image-zoom, card-lift, smooth transitions
- Multi-layer shadow system (shadow-premium, shadow-lifted) for visual depth
- Tier-based color coding: gold (Premium VIP), silver (Corporate), emerald (Eko), primary red (New Year)

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form with Zod validation for form state and validation
- React Context for internationalization (i18n) language switching

**Internationalization**
- Custom i18n implementation with Language Context Provider
- Full bilingual support with translation keys for ME (Montenegrin/Serbian) and EN (English)
- Language preference persisted in localStorage

**Key Design Patterns**
- Component composition with separation between presentational and container components
- Custom hooks for reusable logic (useToast, useIsMobile, useLanguage)
- Type-safe data contracts shared between frontend and backend via `@shared` module

**Dynamic Content Management**
- Hero slider loads slides dynamically from database with fallback to hardcoded images
- Navigation menu loads items dynamically from database with fallback to default menu
- Admin can manage hero slides and menu items with full CRUD operations
- Public endpoints filter by `isActive` flag, admin endpoints return all items for editability
- Language codes use lowercase 'me' and 'en' throughout the system
- Hero component auto-resets currentSlide index when totalSlides changes

**Package Modal System**
- Tab-based interface with 2 main tabs:
  - **"Kompletan Paket" (Complete Package)** - Text-only numbered list of all products with names and descriptions (no images)
  - **"Pojedinačni Proizvodi" (Individual Products)** - Clickable list of products with thumbnails and descriptions, clicking opens detailed view with image galleries
- Product detail views show ProductImageGallery carousel component with full specifications
- State management: activeTab resets to 'complete' on modal open/package change via useEffect
- Navigation controls in detail view: Previous/Next buttons to cycle through products, Back to List button
- Image carousel: Multiple images per product with prev/next buttons and navigation dots
- Premium luxury pricing card with gradient background, serif typography, and centered layout
- Elegant product list with dividers (divide-y divide-border/40) for visual separation
- DialogDescription accessibility compliance for screen readers

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript for API endpoints and middleware
- Session-based authentication using Passport.js with LocalStrategy
- Bcrypt for password hashing with 10 salt rounds

**API Design**
- RESTful API structure with `/api` prefix for all endpoints
- Middleware chain: JSON parsing, URL encoding, request logging with timing
- Protected routes using `requireAuth` middleware for admin functions
- File upload handling with Multer (5MB limit, image files only)
- Separate admin and public endpoints for content:
  - Public: `/api/hero-slides`, `/api/menu-items`, `/api/contact-info`, `/api/about-page`, `/api/package-categories` (active items or singleton data)
  - Admin: `/api/admin/hero-slides`, `/api/admin/menu-items`, `/api/admin/contact-info`, `/api/admin/about-page`, `/api/admin/newsletter-subscribers`, `/api/admin/package-categories` (all items including inactive, full CRUD access)
- Newsletter subscription: `/api/newsletter/subscribe` (public endpoint for email collection)

**Authentication & Sessions**
- Passport.js for authentication strategy implementation
- Express-session with PostgreSQL session store (connect-pg-simple)
- User serialization/deserialization for session management
- Admin-only access for package management operations
- Admin credentials: username `admin`, password `admin123` (change after first login)

**Request/Response Flow**
- Request logging middleware captures method, path, status, duration, and JSON responses
- Error handling with appropriate HTTP status codes
- CORS headers for uploaded file serving

### Data Storage Solutions

**Database**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database operations and schema management
- Connection pooling through @neondatabase/serverless

**Schema Design**
- `users` table: Admin authentication with username/password
- `packages` table: Gift package catalog with bilingual fields (nameME/nameEN), pricing in EUR, category, images
- `package_products` table: Individual items within packages with descriptions and specifications in both languages, images stored as jsonb array
- `package_categories` table: Dynamic package categories with bilingual labels (labelME, labelEN), unique value identifiers, sort order, and active status
- `inquiries` table: Customer contact form submissions
- `hero_slides` table: Homepage carousel slides with bilingual titles/subtitles, image paths, sort order, and active status
- `menu_items` table: Navigation menu items with bilingual labels, paths, sort order, and active status
- `contact_info` table: Contact information with phone, email, WhatsApp, Viber, bilingual addresses, and map coordinates (singleton - single editable record)
- `about_page` table: About Us page content with bilingual titles, content, mission, vision, and image (singleton - single editable record)
- `newsletter_subscribers` table: Email subscribers with status tracking ('active' or 'unsubscribed')

**Pricing**
- All prices stored and displayed in Euros (EUR)
- Display format: "€{amount}" (e.g., "€40")

**Storage Pattern**
- Repository pattern via `IStorage` interface with `DatabaseStorage` implementation
- All database operations abstracted through storage layer methods
- UUID primary keys using PostgreSQL's `gen_random_uuid()`
- Cascade deletion for package-product relationships

**File Storage**
- Local filesystem storage in `/uploads` directory for product images
- Multer disk storage with timestamped unique filenames
- Static file serving via Express middleware
- Path traversal protection with filename sanitization

### External Dependencies

**Third-Party UI Libraries**
- Radix UI suite for accessible component primitives (Dialog, Dropdown, Select, Toast, etc.)
- Lucide React for icon components
- Vaul for drawer/sheet components
- Embla Carousel for image galleries
- CMDK for command palette functionality

**Data & Form Libraries**
- TanStack Query v5 for async state management
- React Hook Form for form handling
- Zod for schema validation
- Drizzle Zod for database schema to Zod schema conversion

**Authentication & Security**
- Passport.js for authentication framework
- Bcrypt for password hashing
- Express-session for session management
- Connect-pg-simple for PostgreSQL session store

**Developer Tools & Build**
- Vite plugins: React, runtime error overlay, Replit-specific tooling (cartographer, dev banner)
- ESBuild for server bundling in production
- TSX for TypeScript execution in development
- Drizzle Kit for database migrations

**Database Connection**
- Neon serverless PostgreSQL driver
- Drizzle ORM with PostgreSQL dialect
- Environment-based database URL configuration

**Utilities**
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional className handling
- date-fns for date manipulation
- nanoid for unique ID generation