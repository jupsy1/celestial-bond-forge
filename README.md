# Star Sign Studio

**Discover your cosmic love story with personalized astrology and celestial insights.**

🌟 **Live Site**: [https://starsignstudio.com](https://starsignstudio.com)

## About

Star Sign Studio is a modern astrology web application that helps users explore their cosmic connections through:

- **Personalized Horoscopes** - Daily, weekly, and monthly readings tailored to your sign
- **Love Compatibility** - Discover your romantic compatibility with other zodiac signs  
- **Celestial Journey** - Explore the deeper meanings behind your astrological profile
- **Interactive Experience** - Beautiful, responsive design with smooth user interactions

## Features

✨ **Modern Authentication**
- Google OAuth sign-in
- Facebook OAuth sign-in
- Secure user sessions with Supabase

🎨 **Beautiful Design**
- Responsive layout that works on all devices
- Dark/light theme support
- Smooth animations and transitions
- Accessible UI components

🔮 **Astrology Tools**
- Comprehensive zodiac sign information
- Compatibility analysis
- Personalized readings and insights

## Technology Stack

This project is built with modern web technologies:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom components
- **UI Components**: shadcn/ui component library
- **Authentication**: Supabase Auth with OAuth providers
- **Icons**: Lucide React icon library
- **Routing**: React Router for navigation

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/star-sign-studio.git

# Navigate to project directory
cd star-sign-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
star-sign-studio/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/         # shadcn/ui components
│   ├── lib/            # Utility functions and configurations
│   ├── pages/          # Application pages/routes
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── index.html          # Main HTML template
└── vite.config.ts      # Vite configuration
```

## Authentication Setup

The app uses Supabase for authentication with social providers:

1. **Google OAuth** - Sign in with your Google account
2. **Facebook OAuth** - Sign in with your Facebook account

Both providers are configured to work seamlessly with the `starsignstudio.com` domain.

## Deployment

The application is deployed and accessible at:
**https://starsignstudio.com**

## Contributing

We welcome contributions to Star Sign Studio! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or support:
- **Website**: [starsignstudio.com](https://starsignstudio.com)
- **Email**: support@starsignstudio.com

---

*Crafted with ✨ cosmic energy and modern web technologies*
