# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Frame Economics is an interactive learning platform that teaches 10 powerful behavioral psychology rules for maintaining psychological composure. It's built as a React TypeScript single-page application with Vite as the build tool and Tailwind CSS for styling.

**Core Purpose**: Educational platform combining behavioral economics principles with practical psychological tactics for managing interpersonal dynamics and maintaining emotional composure.

## Common Development Commands

### Development Server
```bash
npm run dev
```
Starts the Vite development server on `http://localhost:5173`

### Production Build
```bash
npm run build
```
Builds the application for production. Output goes to `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Linting
```bash
npm run lint
```
Runs ESLint with TypeScript support. Uses strict configuration with React hooks and refresh plugins.

### Install Dependencies
```bash
npm install
```
or for CI/production:
```bash
npm ci
```

## Architecture & Code Structure

### High-Level Architecture
- **Single Page Application**: React-based SPA with client-side state management
- **Component Structure**: Modular React components with TypeScript
- **State Management**: Local React state with localStorage persistence for user progress
- **Styling**: Tailwind CSS with custom animations and dark/light theme support

### Key Components
- **`App.tsx`**: Root component handling theme toggle and main layout
- **`FrameEconomicsWebsite.tsx`**: Main application component containing:
  - Rule definitions and behavioral psychology content
  - Progress tracking system
  - Section navigation with URL hash routing
  - Local storage for user progress persistence
- **`ThemeToggle.tsx`**: Theme switcher component
- **`main.tsx`**: Application entry point with React 18 StrictMode

### Interactive Components (src/components/)
- **`Assessment.tsx`**: Interactive diagnostic tool for frame control skills
- **`Community.tsx`**: Community insights, statistics, and peer learning data
- **`Connect.tsx`**: Peer networking platform with:
  - User profile matching and filtering system
  - Virtual and in-person networking events
  - Study group formation and management
  - Mentorship matching platform
- **`ScenarioSimulator.tsx`**: Practice scenarios with branching storylines
- **`HabitTracker.tsx`**: Progress tracking and habit formation tools
- **`Flashcards.tsx`**: Spaced repetition learning system

### Data Architecture
The application centers around a `Rule` interface that structures each behavioral principle:
- Behavioral principle (psychology concept)
- Test scenario (how manipulation appears)
- Trap (common reactive mistakes)
- Counter-move (strategic response)
- Key insight (scientific backing)
- Practical example (real-world application)

### State Management Patterns
- **Progress Persistence**: Uses localStorage with versioned keys (`frame_econ_completed_rules_v2`, `frame_econ_progress_v1`)
- **URL Routing**: Hash-based navigation for deep linking to sections
- **Theme State**: Managed globally with localStorage persistence

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Animations**: Fade-in effects with `prefers-reduced-motion` support
- **Theme System**: Dark/light mode with CSS custom properties
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Typography**: Inter font for optimal readability

## Development Environment

### Required Tools
- **Node.js**: Version 18+ (as specified in GitHub Actions)
- **npm**: Package manager
- **TypeScript**: Strict mode enabled with modern ES2020 target

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### GitHub Pages Deployment
The project uses GitHub Actions for automatic deployment:
- **Trigger**: Push to `main` branch
- **Build Process**: `npm ci` → `npm run build`
- **Output**: `dist/` directory deployed to GitHub Pages
- **Configuration**: `base: './'` in Vite config for GitHub Pages compatibility

### Local Production Testing
```bash
npm run build && npm run preview
```

## Content Structure

### The 10 Behavioral Rules
Each rule follows a consistent educational framework:
1. **Patience Under Fire** (Present Bias Management)
2. **Refusing Unfair Blame** (Framing Effect Defense)
3. **Silence Games** (Loss Aversion Counter-Strategy)
4. **Mood Swings & Emotional Pace** (Anchoring Reset)
5. **Public Pressure** (Social Proof Redirection)
6. **The Masculinity Challenge** (Nudge Theory Resistance)
7. **Moving Goalposts** (Hyperbolic Discounting Protection)
8. **Selective Memory** (Availability Bias Management)
9. **Jealousy Traps** (Relative Comparison Opt-Out)
10. **Rhythm Control** (Default Effect Leadership)

### Scientific Foundation
Content is based on research from:
- Kahneman & Tversky (Prospect Theory)
- Cialdini (Social Proof & Influence)
- Thaler & Sunstein (Nudge Theory)
- Game Theory & Cognitive Load Theory

## Key Technical Considerations

### Performance
- Vite for fast development and optimized production builds
- React 18 with StrictMode for development debugging
- Sourcemaps enabled for debugging production issues

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure
- `prefers-reduced-motion` support for animations

### Code Quality
- TypeScript strict mode with comprehensive type checking
- ESLint with React-specific rules and hooks linting
- Unused locals/parameters detection enabled
- No fallthrough cases in switch statements

### User Experience Features
- **Progress Tracking**: Mark rules as mastered with persistence
- **Print Support**: Export guides as PDF or print for offline reference
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Theme Persistence**: User theme preference saved locally
- **Deep Linking**: URL hash routing for direct section access
- **Interactive Learning**: Scenario simulators, assessments, and flashcards
- **Community Features**: Insights, statistics, and peer learning analytics
- **Networking Platform**: Peer matching, events, study groups, and mentorship
- **Gamification**: Progress tracking, completion badges, and achievement systems

## Development Workflow

When working on this codebase:

1. **Content Updates**: Modify the `rules` array in `FrameEconomicsWebsite.tsx` for behavioral principle changes
2. **Styling Changes**: Use Tailwind classes; custom styles in `index.css`
3. **Component Development**: Follow the existing pattern of TypeScript React functional components
4. **State Management**: Use React hooks with localStorage for persistence
5. **Testing**: Use `npm run preview` to test production builds before deployment

## 🚀 MANDATORY DEPLOYMENT WORKFLOW

**RULE**: For ANY code changes, features, or updates, ALWAYS follow this exact 4-phase process:

### Phase 1: Test Environment
1. ✅ Test changes locally with `npm run dev`
2. ✅ Verify production build with `npm run build`
3. ✅ Check TypeScript compilation is clean
4. ✅ Validate responsive design and functionality

### Phase 2: Version Control (Git)
1. ✅ Review changes with `git status` and `git diff`
2. ✅ Stage and commit with descriptive messages
3. ✅ Push to main branch

### Phase 3: Netlify Deployment Audit
1. ✅ Verify static assets are in git (especially `public/` directory)
2. ✅ Monitor Netlify dashboard for build progress
3. ✅ Confirm deployment completes successfully
4. ✅ Test live site functionality

### Phase 4: Documentation & Audit Trail
1. ✅ Update `DEPLOYMENT_LOG.md` with detailed deployment record
2. ✅ Document any issues encountered and resolutions
3. ✅ Update project documentation if features added
4. ✅ Create audit trail for future reference

**Success Criteria**: Deployment is only complete when all phases pass and live site is verified working.

**Reference**: See `DEPLOYMENT_WORKFLOW.md` for detailed process documentation.

---

The application emphasizes educational content delivery through interactive UI patterns, making complex behavioral psychology accessible through practical examples and clear frameworks.
