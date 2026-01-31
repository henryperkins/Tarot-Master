# Design Guidelines: Tableu - Mystical AI Tarot Reading App

## 1. Brand Identity

**Purpose**: A sophisticated tarot reading companion that merges ancient mysticism with AI intelligence, helping seekers gain insight through beautifully crafted digital readings.

**Aesthetic Direction**: **Luxurious Mystical** - Restrained elegance with esoteric depth. Dark, atmospheric backgrounds create intimacy, while warm gold accents evoke ancient wisdom and candlelit mystery. The experience feels like opening a leather-bound grimoire in a dimly lit study.

**Memorable Element**: The **Mystic Panel Gradient** - radial glows of gold (at top-left), blue (top-right), and pink (bottom) layered over deep charcoal create an unmistakable signature that appears in cards, modals, and key UI moments.

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs) with floating action button for new reading
- **Home Tab**: Reading interface and spread selection
- **Journal Tab**: Saved readings and notes
- **Cards Tab**: 78-card gallery browser
- **Profile Tab**: Account, preferences, subscription

**Core Action**: "New Reading" floating button (centered, elevated above tab bar)

**Key Screens**:
- Onboarding Wizard (first launch, stack-based)
- Spread Selector → Question Input → Card Drawing → Narrative Display
- Card Gallery (Major/Minor Arcana organized by suit)
- Journal List → Entry Detail → Follow-up Threads
- Share Reading (modal with OG preview)

## 3. Color Palette

**Foundation**
- Primary: `#D4B896` (warm gold - buttons, accents, mystical glow)
- Background Main: `#0F0B14` (deep charcoal)
- Background Surface: `#181221` (raised panels)
- Surface Muted: `#1C1525` (subtle elevation)

**Neutrals**
- Text Main: `#E8E6E3` (warm off-white)
- Text Muted: `#9A8C7F` (subdued warm gray)
- Border Warm: `#3A2F3F` (subtle dividers)
- Slate Light: `#7A6F7F` (secondary text)

**Accents**
- Gold Champagne: `#E5C48E` (highlights)
- Gold Soft: `#F5E5C8` (subtle warmth)
- Glow Gold: `rgba(212, 184, 150, 0.35)` (radial effects)
- Glow Blue: `rgba(120, 161, 255, 0.24)` (mystery)
- Glow Pink: `rgba(255, 132, 178, 0.28)` (intuition)

## 4. Typography

**Primary Font**: Cormorant Garamond (serif) - 400, 500, 600
- Titles, card names, mystical headings
- Large display text (spread names)

**Secondary Font**: Ibarra Real Nova - 400, 500, 600
- Body text for narratives
- Italics for card positions and emphasis

**Type Scale**:
- Display: 32px/400/0.15em tracking
- Title: 24px/500
- Heading: 18px/600
- Body: 16px/400
- Caption: 14px/400
- Small: 12px/400/0.08em tracking uppercase

## 5. Screen Specifications

### Spread Selector
- **Purpose**: Choose reading type
- **Layout**: Scrollable grid of spread cards
- **Header**: Transparent with "Choose Your Spread" title
- **Components**: Spread preview cards (show position layout), description text, "Begin" button
- **Safe Area**: top: headerHeight + 16px, bottom: tabBarHeight + 16px

### Card Drawing
- **Purpose**: Interactive card reveal
- **Layout**: Centered card stack with flip animation
- **Header**: Minimal, shows progress "3 of 10"
- **Components**: Animated card deck, tap instruction, haptic feedback on flip
- **Gestures**: Tap to flip, swipe for next
- **Safe Area**: top: headerHeight + 24px, bottom: 24px (no tab bar visible)

### Narrative Display
- **Purpose**: Show AI-generated reading
- **Layout**: Scrollable with sticky card row
- **Header**: "Your Reading" with share/save buttons (right)
- **Components**: Horizontal scrollable card row, streaming text with fade-in, follow-up section at bottom
- **Safe Area**: top: 16px, bottom: tabBarHeight + 16px

### Journal List
- **Purpose**: Browse saved readings
- **Layout**: List with search bar in header
- **Header**: Default with search, filter button (right)
- **Components**: Entry cards (date, spread type, preview), empty state illustration
- **Safe Area**: top: headerHeight + 16px, bottom: tabBarHeight + 16px

### Card Gallery
- **Purpose**: Explore tarot deck
- **Layout**: Sectioned list (Major/Minor Arcana)
- **Header**: Transparent with "The Deck" title
- **Components**: Section headers, card grid items (image + name), card detail modal on tap
- **Safe Area**: top: headerHeight + 16px, bottom: tabBarHeight + 16px

### Profile/Settings
- **Purpose**: Account management
- **Layout**: Scrollable form
- **Header**: Default with "Profile" title
- **Components**: Avatar editor, display name field, subscription tier card, theme toggle, logout
- **Safe Area**: top: 16px, bottom: tabBarHeight + 16px

## 6. Visual Design System

**Mystic Panel Pattern** (signature element):
```
radial-gradient(circle at 0% 18%, glow-gold, transparent 40%),
radial-gradient(circle at 100% 0%, glow-blue, transparent 38%),
radial-gradient(circle at 52% 115%, glow-pink, transparent 46%),
linear-gradient(135deg, #181221, #1C1525 55%, #0F0B14)
```

**Card Shadows**: Floating elements use `shadowOffset: {width: 0, height: 2}`, `shadowOpacity: 0.10`, `shadowRadius: 2`

**Borders**: `#3A2F3F` 1px solid for dividers, `#D4B896` for accent borders (premium features)

**Textures**: Apply subtle parchment noise (22-28% opacity, soft-light blend) to backgrounds for authenticity

**Touch Feedback**: All touchables darken on press (opacity 0.8), premium actions glow gold

## 7. Assets to Generate

**App & Splash**
- `icon.png` - Mystical symbol (moon phases or celestial wheel), gold on dark background, 1024x1024
- `splash-icon.png` - Same symbol, centered on dark gradient, 1024x1024
- WHERE USED: Device home screen, app launch screen

**Empty States**
- `empty-journal.png` - Closed leather-bound book with subtle gold clasp, soft glow
- WHERE USED: Journal screen when no entries exist
- `empty-cards.png` - Single face-down tarot card with ornate back pattern
- WHERE USED: Temporary fallback if card images fail to load

**Onboarding**
- `welcome-illustration.png` - Hands placing three cards in Past-Present-Future layout, mystical lighting
- WHERE USED: First screen of onboarding wizard
- `spread-hero.png` - Celtic Cross layout illustration (all positions labeled)
- WHERE USED: Onboarding step explaining spread positions

**User Avatars** (generate 6 options)
- `avatar-moon.png` - Crescent moon face
- `avatar-star.png` - Eight-pointed star
- `avatar-sun.png` - Stylized sun rays
- `avatar-eye.png` - All-seeing eye in triangle
- `avatar-crystal.png` - Amethyst crystal cluster
- `avatar-tarot.png` - Miniature High Priestess card
- WHERE USED: Profile screen, account settings, default options for user selection

**Style**: All illustrations use muted gold/champagne palette (#D4B896, #E5C48E), soft edges, minimal detail, consistent line weight