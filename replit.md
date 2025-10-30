# Brain Box Gift Packages - E-Commerce Platform

## Overview
Brain Box is a premium e-commerce web application focused on luxury gift packages for the Serbian/Montenegrin market. It offers diverse product categories like New Year's, Corporate, Eco, Local Producers, and Premium VIP packages, with full bilingual support. The platform includes a customer-facing storefront for browsing and inquiries, and an admin panel for comprehensive management of products, categories, content, and subscribers. The project aims to provide a scalable, feature-rich platform with a premium user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for fast development and optimized builds. Wouter handles client-side routing. UI components are developed with Shadcn UI (New York style variant) and Radix UI primitives, styled using Tailwind CSS and a custom premium design system featuring warm cream backgrounds, deep charcoal text, and multi-tier color hierarchy. State management relies on TanStack Query for server state, React Hook Form with Zod for form handling, and React Context for internationalization. The application supports full bilingual capabilities (Serbian/Montenegrin and English) with language persistence. Key design patterns include component composition, custom hooks, and type-safe data contracts. Dynamic content (hero sliders, navigation menus) is loaded from the database, with public and admin endpoints for access control. A sophisticated Package Modal System offers tab-based product views, image galleries, and premium luxury pricing cards.

### Backend Architecture
The backend uses Express.js with TypeScript, providing RESTful APIs with `/api` prefixes. Session-based authentication is implemented with Passport.js and Bcrypt for password hashing. Multer handles file uploads (image files only, 5MB limit). Separate admin and public endpoints ensure controlled access to content management functionalities, including hero slides, menu items, contact information, about page content, and newsletter subscribers. Request logging and error handling are robustly implemented.

### Data Storage Solutions
PostgreSQL is the primary database, utilizing Neon for serverless capabilities and Drizzle ORM for type-safe operations. The schema includes tables for users, packages, package products, categories, inquiries, hero slides, menu items, contact information, about page content, and newsletter subscribers. All prices are stored and displayed in Euros. A repository pattern abstracts database operations. Product images are stored on the local filesystem in the `/uploads` directory with static file serving.

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