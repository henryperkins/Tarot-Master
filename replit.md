# Tableu - Mystical AI Tarot Reading App

## Overview

Tableu is a sophisticated tarot reading companion that merges ancient mysticism with AI intelligence. The app helps users gain insight through beautifully crafted digital readings, featuring a luxurious dark theme with warm gold accents. Built as an Expo/React Native application with a Node.js/Express backend, it delivers AI-powered tarot interpretations using OpenAI's GPT-4o model.

Key features include:
- Multiple tarot spread types (Single Card, Past/Present/Future, Five Card Cross, Celtic Cross, Relationship, Decision)
- Complete 78-card Rider-Waite-Smith tarot deck with upright and reversed meanings
- AI-generated narrative interpretations using GPT-4o
- Journal for saving, reviewing, and reflecting on readings
- Intention Coach with guided question suggestions organized by themes
- Animated card reveal with flip effects
- Offline-first design with AsyncStorage for local data persistence

## Current State
The frontend is fully implemented with all screens functional:
- Home Screen: Spread selection, question input, card drawing
- Reading Screen: Animated card reveal and layout visualization
- Reading Result Screen: AI narrative display with reflection notes
- Journal Screen: Reading history with favorites and search
- Coach Screen: Intention categories with guided questions
- Settings Screen: Preferences and app info

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: React Navigation v7 with bottom tabs and native stack
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Custom theme system in `client/constants/theme.ts` with dark mystical aesthetic
- **Typography**: Google Fonts (Cormorant Garamond for headings, Ibarra Real Nova for body)
- **Animations**: React Native Reanimated for card flip effects and transitions
- **Local Storage**: AsyncStorage for journal entries and reading history

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL via Drizzle ORM
- **AI Integration**: OpenAI API (GPT-4o) for generating tarot reading narratives
- **API Design**: RESTful endpoints under `/api/` prefix

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - contains users, readings, journal entries, and chat models
- **Migrations**: Managed via `drizzle-kit push`

### Key Design Decisions

1. **Monorepo Structure**: Client (`client/`), server (`server/`), and shared code (`shared/`) in one repository for code sharing between frontend and backend.

2. **Force Dark Mode**: The app always uses dark theme regardless of system settings to maintain mystical aesthetic consistency.

3. **Offline-First Journal**: Readings are stored locally in AsyncStorage rather than requiring immediate server sync, allowing offline usage.

4. **Replit AI Integrations**: Pre-built utilities in `server/replit_integrations/` for audio streaming, chat persistence, and batch processing.

5. **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/` for clean imports.

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for generating tarot reading narratives
  - Environment variable: `AI_INTEGRATIONS_OPENAI_API_KEY`
  - Base URL override: `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Database
- **PostgreSQL**: Primary data store
  - Environment variable: `DATABASE_URL`
  - Provisioned through Replit

### Native Capabilities
- **expo-haptics**: Tactile feedback for card interactions
- **expo-blur**: Glass-effect UI elements
- **expo-linear-gradient**: Background gradients for mystical panel effects
- **expo-image**: Optimized image loading for tarot card artwork

### Development Infrastructure
- **Replit Environment Variables**:
  - `EXPO_PUBLIC_DOMAIN`: API endpoint domain
  - `REPLIT_DEV_DOMAIN`: Development server domain
  - `REPLIT_DOMAINS`: Production domains for CORS

### Planned Integrations (from attached docs)
- Stripe for subscription payments (not yet implemented)
- Azure OpenAI/Anthropic as fallback AI providers
- Text-to-Speech for audio readings