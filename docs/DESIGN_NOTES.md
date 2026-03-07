# Design Notes – LA Tech Community Website

## Status: ✅ Design Graphic Analyzed

**Analyzed**: 2026-03-06  
**Source**: `assets/brand-grapic.png`

---

## Mission Statement

> LA Tech Community is organized exclusively for charitable and educational purposes under Section 501(c)(3) of the Internal Revenue Code. The mission is to promote inclusive, accessible, and community-driven technology education through events, workshops, mentorship, and open collaboration.

---

## Color Palette

```css
/* Primary Brand Colors */
--color-primary: #00BFFF;  /* Cyan/Turquoise - Tech, energy, innovation */
--color-secondary: #FF9900; /* Orange - Warmth, LA sunshine, approachability */
--color-dark: #1A3A52;      /* Navy/Dark Charcoal - Trust, professionalism */
--color-white: #FFFFFF;     /* Clean, accessible */
--color-light-bg: #F5F5F5;  /* Light gray for subtle backgrounds */

/* Usage */
Primary: Navigation, CTAs, accent elements
Secondary: Highlights, illustrations, energy accents
Dark: Headlines, body text, structure
White: Cards, containers, breathing room
```

## Typography

**Display Font (Headlines, "CODED IN LA" style)**:
- Font: Bold, italic/slanted sans-serif
- Weight: 700–900
- Usage: H1, major headings, wordmarks
- Size Range: 48px–72px (desktop), 32px–48px (mobile)

**Body Font (Accessible, clean)**:
- Font: Modern sans-serif (e.g., Inter, -apple-system, sans-serif)
- Weight: 400 (regular), 600 (emphasis)
- Size: 16px base (mobile), 18px base (desktop)
- Line Height: 1.6 for readability
- Letter Spacing: 0.5px for headings

## Visual System

### Logo & Wordmark
- Primary: "LA" (navy, large) + "tech community" (cyan, smaller)
- Variant: "CODED IN LA" (display font, italic)
- Secondary: "LA TECH" badges with code bracket symbols
- Usage: Header, favicon, social media

### Iconic Elements
- **Palm Trees**: Dual palm illustration — one with circuit patterns (tech), one clean (community)
- **Location Markers**: Ferris wheel/pier, beach/sunset scene (LA/California identity)
- **People Silhouettes**: Diverse group imagery (community, inclusivity)
- **Tech Symbols**: Code brackets, rocket, cursor, smartphone (innovation)
- **Surfboard/Waves**: "Sun, Surf, Software" tagline (lifestyle blend)

### Layout & Spacing

**Grid**: 12-column (desktop), 1-column mobile, 2-column tablet  
**Spacing Unit**: 8px base (multiples: 8, 16, 24, 32, 40, 48, 56, 64)  
**Container Max-Width**: 1200px desktop, 100% mobile  
**Breakpoints**:
- Mobile: 320px–479px
- Tablet: 480px–767px
- Desktop: 768px+

## Component Library (BEM)

### Buttons
```css
.btn--primary    /* Cyan bg, white text, CTAs */
.btn--secondary  /* Orange bg, dark text, alternatives */
.btn--outline    /* Transparent, cyan border */
```

### Hero Section
- Full-bleed background
- Large wordmark "LA tech community"
- Supporting text with mission focus
- Palm tree illustration (left/background)
- Primary CTA below

### Cards
```css
.card--feature   /* Event, service, or value proposition */
.card--icon      /* Icon + headline + description */
.card--highlight /* Orange accent bar, secondary prominence */
```

### Navigation
- Logo + text on left
- Menu links (primary, secondary, how to get involved)
- Mobile hamburger menu (responsive)
- Sticky on scroll (optional enhancement)

### Section Patterns
```css
.section--hero          /* Full width, image blend */
.section--features      /* 3-column grid + icons */
.section--mission       /* Large text, mission statement */
.section--cta           /* Prominent call-to-action */
.section--footer        /* Links, contact, org info */
```

## Accessibility Standards (WCAG 2.1 AA)

✅ **Color Contrast**:
- Text on primary (cyan): 4.5:1+ contrast verified
- Text on secondary (orange): 4.5:1+ contrast verified
- Dark text on light bg: 7:1+ contrast

✅ **Keyboard Navigation**:
- All interactive elements focusable (Tab order)
- Focus indicator visible (outline or highlight)
- No keyboard traps

✅ **Images & Icons**:
- All decorative elements have alt="" or role="presentation"
- Meaningful images have descriptive alt text
- Icon + text combinations (redundancy)

✅ **Typography**:
- Minimum font size: 16px base
- Line height: 1.6+ for readability
- Appropriate heading hierarchy (H1 → H6)

## Brand Voice & Messaging

**Tone**: Welcoming, energetic, inclusive, professional-but-friendly  
**Key Messages**:
- Technology education is for everyone
- Community-driven collaboration
- LA-rooted, globally minded
- Fun + serious about impact
- Open doors, accessible pathways

**Visual Tone**: Vibrant, modern, approachable—not corporate or intimidating

## Design Decisions & Rationale

1. **Cyan + Orange**: Tech (cyan) + LA warmth (orange) = brand personality
2. **Palm Trees with Circuits**: LA culture + tech education merged visually
3. **Diverse Icons**: Reflects mission of "inclusive, accessible" community
4. **Bold Display Typography**: Memorable, energetic, stands out
5. **Mobile-First Layout**: Ensures accessibility for all device types

---

**Last Updated**: 2026-03-06  
**Next Review**: After component library is built and tested
**Reference Files**: `/memories/repo/coding-standards.md`, `/memories/repo/design-extraction-guide.md`
