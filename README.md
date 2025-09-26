# Frame Control Economics v2

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

## 🎯 Project Overview

Frame Control Economics v2 is a complete rewrite and modernization of the original Frame Economics platform, featuring advanced motion design, cutting-edge CSS techniques, and a sophisticated design system built for behavioral psychology education.

## ✨ Key Features

### 🎨 Advanced Design System
- **OKLCH Color Space** - Perceptually uniform colors for consistent contrast
- **Container Queries** - Component-based responsive design
- **Design Tokens** - Semantic CSS custom properties
- **Glass Morphism** - Modern frosted glass UI effects

### 🎭 Motion Design System
- **Framer Motion Integration** - High-performance animations
- **Parallax Effects** - Scroll-linked motion with varying speeds
- **Intersection Observers** - Progressive reveal animations
- **Accessibility First** - Respects `prefers-reduced-motion`
- **SVG Animations** - Interactive data visualizations

### 🏗️ Modern Architecture
- **React 18** - Latest React features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Netlify Functions** - Serverless backend

## 🚀 Live Demo

Visit the live demo: [https://frame-control-economics-v2.netlify.app](https://frame-control-economics-v2.netlify.app)

## 📱 Demo Sections

1. **Hero Section** - Original Frame Economics showcase with modern design
2. **Rule Cards** - Interactive behavioral psychology rules
3. **Motion Demo** - Advanced animation patterns and data visualization

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion
- **Build Tool**: Vite
- **Styling**: CSS Container Queries, OKLCH Colors, Custom Properties
- **Deployment**: Netlify with automatic deployments
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Frame-Control-Economics-v2.git
cd Frame-Control-Economics-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── motion/          # Motion system components
│   │   ├── TechBackdrop.tsx
│   │   ├── DragonMark.tsx
│   │   ├── primitives.tsx
│   │   └── MotionConfig.ts
│   ├── ParallaxCards.tsx
│   ├── RevealSection.tsx
│   ├── SmoothNav.tsx
│   └── AnimatedChart.tsx
├── styles/              # CSS design system
│   ├── tokens.css       # Design tokens
│   ├── layout.css       # Container queries
│   └── motion.css       # Animation utilities
├── pages/               # Page components
├── contexts/            # React contexts
└── lib/                # Utilities and configurations

netlify/
└── functions/          # Serverless functions
```

## 🎨 Design System

### Color System (OKLCH)
- Uses perceptually uniform OKLCH color space
- Ensures consistent contrast across all hues
- Semantic color tokens for maintainability

### Typography Scale
- Fluid typography with CSS clamp()
- Responsive font sizes using container queries
- Optimized for readability across devices

### Motion System
- Hardware-accelerated animations
- Consistent timing and easing curves
- Accessibility-first approach

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - Configure any required environment variables in Netlify dashboard

3. **Deploy Settings**
   - Automatic deployments on push to main branch
   - Branch deploys for pull requests

### Build Configuration

The project includes optimized build settings:
- Vite for fast builds
- Tree-shaking for minimal bundle size
- Asset optimization
- Modern JavaScript output

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📈 Performance Features

- **Code Splitting** - Automatic route-based splitting
- **Asset Optimization** - Optimized images and fonts
- **Progressive Enhancement** - Works without JavaScript
- **Core Web Vitals** - Optimized for Google's performance metrics

## ♿ Accessibility Features

- **Semantic HTML** - Proper document structure
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Motion Preferences** - Respects `prefers-reduced-motion`
- **Color Contrast** - WCAG AA compliant colors

## 🔧 Customization

### Design Tokens
Modify `src/styles/tokens.css` to customize:
- Colors (OKLCH values)
- Typography scales
- Spacing systems
- Border radius values
- Shadow definitions

### Motion Settings
Adjust animation settings in `src/components/motion/MotionConfig.ts`:
- Duration values
- Easing curves
- Stagger delays

## 📱 Browser Support

- **Modern Browsers** - Chrome 88+, Firefox 87+, Safari 14+
- **Container Queries** - Supported with fallbacks
- **OKLCH Colors** - Progressive enhancement
- **CSS Custom Properties** - Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Frame Economics** - Original concept and content
- **OKLCH Color Space** - Advanced color science
- **Container Queries** - Next-gen responsive design
- **Framer Motion** - Delightful animations

---

Built with ❤️ using modern web technologies for the next generation of behavioral psychology education.