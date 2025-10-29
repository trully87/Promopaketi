# Design Guidelines: Brain Box Gift Packages Web Application

## Design Approach

**Reference-Based Design** drawing inspiration from premium e-commerce platforms (Shopify, Etsy) combined with luxury gift packaging aesthetics. The design emphasizes visual richness, product storytelling, and emotional appeal while maintaining professional credibility for B2B corporate clients.

## Core Design Principles

1. **Premium Elegance**: Sophisticated, high-end presentation befitting luxury gift packages
2. **Visual Product Focus**: Let package photography and details drive engagement
3. **Dual Audience Balance**: Appeal to both emotional gift-giving and corporate purchasing decisions
4. **Bilingual Seamlessness**: Equal treatment of Serbian/Montenegrin and English content

## Color Palette

**Primary Colors:**
- Deep Crimson Red (#C41E3A) - CTAs, accents, festive elements
- Charcoal Grey (#2D3436) - Primary text, headers
- Pure Black (#000000) - Strong typography, premium feel
- Warm White (#FAFAFA) - Backgrounds, breathing room

**Secondary Colors:**
- Metallic Silver (#B8B8B8) - Borders, subtle accents
- Deep Forest Green (#1B4332) - Secondary CTAs, natural product emphasis
- Soft Cream (#F5F1E8) - Alternative background sections, warmth
- Rose Gold (#B76E79) - Hover states, premium touches

## Typography

**Font Families:**
- Primary: "Playfair Display" (serif) - Headers, premium feel
- Secondary: "Inter" (sans-serif) - Body text, UI elements
- Accent: "Cormorant Garamond" (serif) - Package titles, elegant moments

**Hierarchy:**
- H1: 64px/72px (desktop/mobile), Playfair Display, Bold
- H2: 48px/56px, Playfair Display, Semibold
- H3: 32px/40px, Inter, Bold
- H4: 24px/28px, Inter, Semibold
- Body: 18px/24px, Inter, Regular
- Small: 14px/20px, Inter, Regular

## Layout System

**Spacing Scale (Tailwind units):**
- Micro spacing: 2, 3 units (gaps, tight padding)
- Standard spacing: 4, 6, 8 units (component padding, margins)
- Section spacing: 12, 16, 20, 24 units (vertical rhythm)
- Hero/Major sections: 32, 40 units (dramatic spacing)

**Grid System:**
- Desktop: 12-column grid, max-w-7xl container
- Package cards: 3-column grid (lg:grid-cols-3)
- Feature sections: 2-column splits (lg:grid-cols-2)
- Mobile: Always single column stacking

**Container Widths:**
- Full-width sections: w-full with inner max-w-7xl
- Content sections: max-w-6xl
- Package details: max-w-5xl
- Text content: max-w-3xl

## Component Library

### Navigation
- Fixed header with language toggle (ME/EN flags)
- Logo left, navigation center, CTA button right
- Dropdown mega-menu for package categories (Novogodišnji/Corporate)
- Mobile: Hamburger menu with slide-in drawer
- Sticky on scroll with subtle shadow

### Hero Section
- Full-width cinematic image showcase (80vh)
- Featured package photography with luxury styling
- Centered headline + subheadline overlay
- Dual CTA buttons (primary: "Pogledaj pakete", secondary: "Kontaktirajte nas")
- Subtle scroll indicator animation
- **Image**: Large hero showcasing elegantly arranged gift packages on premium dark background with festive accents

### Package Cards
- Elevated card design with shadow-lg on hover
- High-quality product photography (2:3 aspect ratio)
- Package title (Cormorant Garamond)
- Price display (large, bold, red accent)
- Bulleted inclusions list with custom checkmark icons
- "Saznaj više" button
- Hover: Lift effect (translate-y-2) + shadow enhancement

### Package Detail Pages
- Hero product image carousel (main + thumbnail gallery)
- Sticky sidebar with price, minimum order, inquiry button
- Tabbed content: Uključuje / Personalizacija / Dimenzije
- Individual product item showcases with descriptions
- Color/variant selectors with visual swatches
- Related packages carousel

### Contact/Inquiry Forms
- Multi-step form with progress indicator
- Step 1: Package selection (visual cards)
- Step 2: Customization preferences (logo upload, quantity)
- Step 3: Contact details
- **Form Styling**: Floating labels, red focus states, generous padding (p-6)
- Success state with confirmation animation
- Background: Soft gradient (cream to white)

### Admin Dashboard (Backend considerations)
- Clean sidebar navigation
- Package management table with inline editing
- Drag-and-drop image upload zones
- Rich text editor for descriptions
- Color picker for customization options
- Preview mode before publishing

### Footer
- Multi-column layout (4 columns on desktop)
- Column 1: Logo + company description
- Column 2: Quick Links (Novogodišnji paketi, Korporativni paketi, O nama)
- Column 3: Contact information
- Column 4: Newsletter signup form
- Bottom bar: Social media icons, language toggle, legal links
- Background: Deep charcoal with white text

## Section Components

### Package Categories Section
- Two-column split showcasing main categories
- Left: Novogodišnji paketi (festive imagery)
- Right: Korporativni paketi (professional imagery)
- Hover: Image zoom effect, overlay darkens with CTA
- **Images**: Category representative packages in lifestyle settings

### Featured Packages Carousel
- Auto-rotating carousel (5s intervals)
- Large package images with product details overlay
- Navigation dots + arrow controls
- Minimum 3 packages featured

### Customization Showcase
- Icon-based grid explaining personalization options
- Icons: Logo printing, color selection, custom packaging
- Short descriptive text under each icon
- Visual examples in lightbox on click

### Trust Indicators
- Client logo wall (grayscale, hover color)
- Testimonial cards with company names
- "Minimalna narudžba" and delivery information badges

### Process Section
- Numbered step cards (1-4)
- Step flow: Browse → Customize → Order → Deliver
- Icons representing each step
- Connecting lines between steps

## Animations & Interactions

**Subtle & Purposeful:**
- Page transitions: Fade in content (300ms)
- Card hovers: Lift + shadow (transform duration-200)
- Form interactions: Label float on focus
- Image loading: Blur-up technique
- Scroll-triggered: Fade-in-up for sections (intersection observer)
- NO carousels auto-playing without user control
- NO distracting background animations

## Images Strategy

**Required Images:**
1. **Hero**: Luxury gift package arrangement on dark elegant surface with holiday elements
2. **Package Photography**: Professional product shots for each of 9 packages (4 New Year + 5 Corporate)
3. **Individual Items**: Close-up shots of mugs, thermoses, notebooks, etc.
4. **Lifestyle**: Packages in corporate office settings, holiday scenes
5. **Category Headers**: Representative images for Novogodišnji and Korporativni sections
6. **Customization Examples**: Before/after showing logo printing
7. **Team/About**: Professional photos for company credibility

**Image Treatment:**
- Consistent lighting and backgrounds across product shots
- Subtle vignette on lifestyle images
- Maintain aspect ratios: 2:3 for product cards, 16:9 for banners
- Lazy loading for performance
- WebP format with JPG fallback

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px-1024px (2-column grids, condensed spacing)
- Desktop: > 1024px (full layouts)

**Mobile Optimizations:**
- Touch-friendly tap targets (min 44px)
- Simplified navigation (hamburger menu)
- Collapsed forms with accordion sections
- Single-column package grids
- Reduced image sizes, optimized loading

## Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML throughout
- Focus states visible (red outline, 3px)
- Alt text for all product images (descriptive)
- Form labels always associated
- Keyboard navigation support
- ARIA labels for interactive elements
- Language attribute switching (lang="me" / lang="en")

This comprehensive design creates a premium, conversion-focused e-commerce experience that showcases Brain Box's gift packages with elegance while providing robust management capabilities for future package creation.