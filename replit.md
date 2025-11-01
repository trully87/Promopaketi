# Brain Box Gift Packages - E-Commerce Platform

## Overview
Brain Box is a premium e-commerce web application focused on luxury gift packages for the Serbian/Montenegrin market. It offers diverse product categories like New Year's, Corporate, Eco, Local Producers, Technology, Sport & Recreation, and Premium VIP packages, with full bilingual support. The platform includes a customer-facing storefront for browsing and inquiries, a custom package CTA section, and an admin panel for comprehensive management of products, categories, content, and subscribers. The project aims to provide a scalable, feature-rich platform with a premium user experience.

## Recent Changes (November 1, 2025)
- **Playfair Display Typography**: Applied elegant Playfair Display serif font to all headings (h1, h2, h3) on About Us page for premium editorial aesthetic

## Recent Changes (October 31, 2025)
- **Premium About Us Page with Advanced Animations**: Implemented Mentalist Agency-inspired About page with 5 animated sections using Framer Motion, plus premium visuals and client showcase. Features include:
  - **Hero**: Fluid animated liquid background with 6 independent flowing gradient shapes (primary/amber/orange, blue/cyan/emerald, purple/pink, yellow, teal combinations), complex multi-axis movement (scale, rotate, translate), staggered timing (18-30s cycles), vignette overlay for depth
  - **Stats**: Animated counters that count up when scrolling into view, hover scale effects, staggered animations
  - **Clients**: "Brands That Trust Us" section with 12 monochromatic placeholder logos, grayscale-to-color hover effects, staggered entrance animations, subtle glow effects
  - **Story**: Fade-in-up animations, decorative quote marks, gradient backgrounds, 3-image collage (collaboration scene, gift packaging, partnership concept) with hover tilt/scale effects
  - **Values**: Staggered card animations, hover lift effects (y: -8px), gradient overlays, border color transitions
  - **CTA**: Radial gradient background, scale/tap animations on button
  - All sections use scroll-triggered animations with viewport detection for performance
  - **Generated Premium Images**: 3 AI-generated images in Mentalist Agency style (modern minimalist, pastel colors, business themes) imported from attached_assets/generated_images/
- **Search UX Refinement**: Moved GlobalSearch component to top-right corner of navigation (before Admin/Language buttons). Redesigned as subtle icon-only button (w-9) that expands to full search input (w-64) on focus. Reduced visual prominence while maintaining Cmd/Ctrl+K keyboard shortcut functionality.
- **How We Work Section**: Added homepage section between Hero and Packages showcasing 4-step process (Understanding, Design, Production, Delivery) with premium card design, icons, and bilingual support.
- **Premium Copy Update**: Updated all hero/footer/category copy to professional B2B tone inspired by Mentalist Agency ("Your Partner for Complete Business Solutions", "end-to-end solutions", partnership approach).

## Recent Changes (Earlier - October 30, 2025)
- **Production Database Auto-Seeding & Session Persistence**: Complete production deployment solution
  - **Auto-Migrate Script** (scripts/auto-migrate-production.ts): Automatically seeds 7 package categories AND all 37 packages with 136 products when production database is empty. Script runs automatically on production server startup. Package data is stored in scripts/packages-seed-data.ts (auto-generated from development database).
  - **PostgreSQL Session Store** (server/auth.ts, server/storage.ts): Implemented PostgreSQL-based session persistence using `connect-pg-simple`. Sessions now survive server restarts and work correctly in production. Uses separate `pg.Pool` instance for session store compatibility. Session cookies configured with `secure: false` and `sameSite: "lax"` for reliable cross-domain authentication.
  - **Security Fix**: Removed scripts containing hardcoded production database credentials (direct-neon-sync.ts, seed-production-via-api.ts, CREATE-ADMIN-USER.sql) per security audit. Admin user is NOT auto-seeded to avoid hardcoded password risks.
  - **Admin Setup**: Production admin user must be created manually through Database UI with secure bcrypt-hashed password. See PRODUCTION-SETUP.md for detailed instructions.

## Recent Changes (Earlier - October 30, 2025)
- **Production Session & Image Fixes**: Resolved production-specific session persistence and missing asset issues
  - **Session Cookie Configuration** (server/auth.ts): Changed `sameSite` from "strict" to "lax" to allow session cookies to persist across authentication redirects. Fixes admin login redirect loop where successful authentication was lost during navigation. Maintains CSRF protection with POST-only mutations. Architect-reviewed and production-ready.
  - **Custom Package Section Image Fallback** (client/src/components/CustomPackageSection.tsx): Added graceful handling for missing hero images with `onError` handler and dynamic layout adjustment. Includes `useEffect` to reset error state when new images are uploaded, preventing stuck error states. Section switches from 2-column to single-column layout when image is unavailable.
  - **Migration Script Updates** (scripts/auto-migrate-production.ts, scripts/setup-production-db.ts): Corrected default image path from non-existent `/uploads/custom-packages-hero.jpg` to existing `/uploads/Custom_package_consultation_scene_ba549a84.png`. Note: Production uploads folder is non-persistent; admins should upload images via admin panel for production use.
- **Previous Production Deployment Fixes**: Resolved critical issues affecting production builds
  - **Navigation Dropdown**: Replaced ALL Radix UI components (NavigationMenu, DropdownMenu) with **completely custom dropdown** implementation using plain React state + HTML + CSS. Eliminates portal/SSR/build incompatibility issues that prevented dropdown from opening on promopaketi.com production domain. Custom implementation uses useState for open/close, useRef+useEffect for click-outside detection, absolute positioning, and CSS fadeIn animation. Production-safe and architect-verified.
  - **Admin Login Redirect**: Enhanced redirect logic using `window.location.href` instead of SPA navigation, with dual cache invalidation (invalidateQueries + refetchQueries) and requestAnimationFrame + 150ms setTimeout for proper DOM/state synchronization in production
  - **Route Ordering**: Moved `/api/packages/featured` before `/api/packages/:id` to prevent Express parameter matching conflicts
  - **Database Connection Management**: Implemented automatic production database migrations (`scripts/auto-migrate-production.ts`) that run on server startup when `NODE_ENV=production`. Migration script adds missing `is_featured` and `featured_order` columns to packages table and creates `custom_package_section` table. Uses Neon's built-in connection pooling (deprecated manual `fetchConnectionCache` removed). Single database connection instance shared across application via `server/storage.ts` to prevent "too many connections" errors in production.
- **Featured Packages System**: Implemented admin-controlled homepage package curation allowing selection and ordering of up to 8 featured packages

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for fast development and optimized builds. Wouter handles client-side routing. UI components are developed with Shadcn UI (New York style variant) and Radix UI primitives, styled using Tailwind CSS and a custom premium design system featuring warm cream backgrounds, deep charcoal text, and multi-tier color hierarchy. State management relies on TanStack Query for server state, React Hook Form with Zod for form handling, and React Context for internationalization and user preferences. The application supports full bilingual capabilities (Serbian/Montenegrin and English) with language persistence. Key design patterns include component composition, custom hooks, and type-safe data contracts. Dynamic content (hero sliders, navigation menus) is loaded from the database, with public and admin endpoints for access control. A sophisticated Package Modal System offers tab-based product views, image galleries, and premium luxury pricing cards.

#### SEO & Analytics Implementation
The platform includes comprehensive SEO optimization with bilingual support. MetaTags component provides dynamic page titles and descriptions in both languages. Open Graph and Twitter Card meta tags enable rich social media previews. Dynamic sitemap.xml endpoint at `/api/sitemap.xml` generates XML with all packages, categories, and static pages. JSON-LD structured data implements Schema.org standards for Organization (homepage) and Product (package detail) schemas. All SEO helpers include SSR safety guards with `typeof window !== 'undefined'` checks and fallback to environment variables.

#### UX Enhancements
User experience features include Favorites/Wishlist functionality with localStorage persistence (max 50 items), accessible via heart icon on PackageCard components. Recently Viewed tracking automatically records packages when users open PackageModal, maintaining history of up to 8 packages. Both features use React Context with useCallback memoization to prevent re-render loops, providing stable function references across component tree.

### Backend Architecture
The backend uses Express.js with TypeScript, providing RESTful APIs with `/api` prefixes. Session-based authentication is implemented with Passport.js and Bcrypt for password hashing. Multer handles file uploads (image files only, 5MB limit). Separate admin and public endpoints ensure controlled access to content management functionalities, including hero slides, menu items, contact information, about page content, and newsletter subscribers. Request logging and error handling are robustly implemented. Dynamic sitemap generation endpoint serves XML formatted sitemap with lastmod timestamps, changefreq priorities, and hierarchical URL structure for search engine indexing.

### Data Storage Solutions
PostgreSQL is the primary database, utilizing Neon for serverless capabilities and Drizzle ORM for type-safe operations. The schema includes tables for users, packages, package products, categories, inquiries, hero slides, menu items, contact information, about page content, newsletter subscribers, and custom package section. All prices are stored and displayed in Euros. A repository pattern abstracts database operations. Product images are stored on the local filesystem in the `/uploads` directory with static file serving.

#### Custom Package Section
Singleton content table for managing the homepage custom package CTA section. Includes bilingual fields (ME/EN) for title, description, CTA button text, and image URL. Admins can create or edit this section through the admin panel, and it displays on the homepage between package categories and contact form. If no section exists, the homepage gracefully hides it without errors.

#### Featured Packages System
Admin-controlled homepage package curation system using `isFeatured` boolean and `featuredOrder` integer fields in packages table. Admins can select up to 8 packages to feature on the homepage via `/admin/featured-packages` interface. Featured packages appear in a dedicated section at the top of the homepage packages area, before category sections. Admin UI provides visual package grid with one-click toggle for featured status, automatic order assignment, and limit enforcement. Public API endpoint `/api/packages/featured` returns only featured packages sorted by featuredOrder. If no packages are featured, the homepage section is hidden gracefully.

## External Dependencies

### Third-Party UI Libraries
- Radix UI: Accessible component primitives
- Lucide React: Icon components
- Vaul: Drawer/Sheet components
- Embla Carousel: Image galleries

### Data & Form Libraries
- TanStack Query v5: Async state management
- React Hook Form: Form handling
- Zod: Schema validation
- Drizzle Zod: Database schema to Zod schema conversion

### Authentication & Security
- Passport.js: Authentication framework
- Bcrypt: Password hashing
- Express-session: Session management
- Connect-pg-simple: PostgreSQL session store

### Database Connection
- Neon serverless PostgreSQL driver
- Drizzle ORM: PostgreSQL dialect

### Utilities
- class-variance-authority: Component variant management
- clsx and tailwind-merge: Conditional className handling
- date-fns: Date manipulation
- nanoid: Unique ID generation