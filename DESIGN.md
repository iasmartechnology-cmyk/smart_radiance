---
name: Luminous Professional
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4d4635'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#5f5e58'
  on-tertiary: '#ffffff'
  tertiary-container: '#b5b3ac'
  on-tertiary-container: '#464540'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#e5e2da'
  tertiary-fixed-dim: '#c9c6bf'
  on-tertiary-fixed: '#1c1c17'
  on-tertiary-fixed-variant: '#474741'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 120px
---

## Brand & Style
The design system embodies a premium, high-trust digital transformation aesthetic. It merges the functional precision of high-end productivity tools with the warmth of luxury editorial design. The visual narrative is built on the concept of "Illuminated Clarity"—using light, air, and subtle golden accents to guide the user through complex digital landscapes.

The style is a hybrid of **Modern Corporate** and **Minimalist Glassmorphism**. It prioritizes extreme legibility, generous whitespace, and a tactile sense of depth through soft, layered surfaces. The emotional response should be one of calm confidence, conveying that technology is an elegant tool for human progress rather than a cold, mechanical necessity.

## Colors
The palette is rooted in organic, warm neutrals to differentiate from the cold blues typically found in tech. 

- **Primary (Warm Gold):** Used sparingly for high-impact actions, active states, and critical highlights. It represents "Radiance" and premium value.
- **Secondary (Cream/Off-White):** The foundational surface color. It provides a softer, more sophisticated background than pure white, reducing eye strain and feeling more "editorial."
- **Tertiary (Soft Beige/Gray):** Used for subtle grouping, borders, and secondary containers to create soft contrast against the cream background.
- **Neutral (Soft Black):** A deep charcoal rather than true black (#000) to maintain a soft, high-end feel for typography and iconography.

## Typography
The typography strategy utilizes **Geist** for its technical precision and "Linear-style" sophistication in headings and labels, paired with **Inter** for body copy to ensure maximum readability and a "Stripe-like" clarity.

Headlines should use tight letter-spacing and substantial line heights to command the page. Labels are treated with slight tracking (letter-spacing) and uppercase styling to denote hierarchy without increasing font size. Use the `display-lg-mobile` variant for any viewport under 768px to maintain visual balance.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Extravagant Padding"—using space as a luxury signal. 

- **Vertical Rhythm:** Sections are separated by large gaps (120px+) to allow the content to breathe. 
- **Alignment:** Content is generally center-aligned for marketing pages and left-aligned for functional dashboards.
- **Safe Areas:** Ensure a minimum of 64px horizontal margin on desktop to prevent content from touching the edges of the viewport, maintaining the "premium" isolated feel.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Ambient Shadows**. Instead of harsh drop shadows, this design system uses multiple stacked box-shadows with very low opacity (2-4%) and a slight golden-brown tint to the shadow color to maintain warmth.

1.  **Level 0 (Base):** Secondary color (#F9F7F2).
2.  **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border of Tertiary (#F0EDE5).
3.  **Level 2 (Floating/Modals):** White with a large, diffused "Ambient Glow" shadow (Blur: 40px, Spread: -10px, Color: rgba(212, 175, 55, 0.05)).

Glassmorphism is used for navigation bars and sticky headers, employing a `backdrop-filter: blur(20px)` and a semi-transparent White (80% opacity) background.

## Shapes
The shape language is "Organic Geometric." While the grid is strict, the corners are generous. 

- **Standard Elements:** Buttons and input fields use `0.5rem` (rounded).
- **Containers:** Large cards and content sections use `rounded-xl` (1.5rem) to evoke a friendly, modern hardware feel reminiscent of Apple’s industrial design.
- **Interactive States:** When hovered, elements may transition to a slightly larger radius or a subtle "squish" effect to feel tactile.

## Components
- **Buttons:** Primary buttons use a solid Warm Gold background with White text. Secondary buttons use a White background, Soft Black text, and a subtle Tertiary border. Avoid heavy gradients; use a 2% vertical tint if depth is needed.
- **Inputs:** Fields are White with a 1px Tertiary border. On focus, the border transitions to Warm Gold with a soft 4px outer glow.
- **Cards:** White surfaces with `rounded-xl` corners. Use subtle internal padding (32px) to ensure content never feels crowded.
- **Chips/Badges:** Use a light tint of the primary color (e.g., #D4AF37 at 10% opacity) with Gold text for status indicators.
- **Iconography:** Use "Linear" style icons—thin strokes (1.5px), non-filled, with rounded ends. Icons should be sized at 20px or 24px within a larger touch target.
- **Progress Indicators:** Use thin, elegant lines. Avoid chunky loading bars; prefer a shimmering "skeleton" state that mimics the secondary/tertiary color palette.