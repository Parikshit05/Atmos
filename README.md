# Atmos — Living Weather

<p align="center">
  <strong>A premium, immersive weather experience that communicates the sky through visuals, animations, and atmosphere.</strong>
</p>

---

## Live Demo

> *Deploy to Vercel/Netlify and add your link here*

---

## Features

### Sky Engine
- Real-time animated sky with 9 layered visual elements
- 9-phase day cycle (Dawn → Morning → Noon → Afternoon → Golden Hour → Sunset → Blue Hour → Night → Late Night)
- 7 weather states with smooth transitions
- Parallax cloud system with wind simulation
- Rain, snow, lightning, fog, and particle effects
- Sun with lens flare, moon with crater details, twinkling stars with shooting stars

### Weather Data
- Current conditions with animated temperature display
- 24-hour hourly forecast with horizontal scroll
- 7-day forecast with temperature range bars
- Interactive temperature trend chart (Recharts)
- 8 detail cards: Humidity, Pressure, Wind, Visibility, UV Index, Cloud Cover, Rain Chance, Sunrise/Sunset

### UI/UX
- Cinematic loading experience with animated logo
- Floating glass navbar with scroll hide/show
- Custom cursor that changes color with weather
- Glassmorphism throughout with weather-reactive materials
- Smooth stagger animations on every element
- Spring physics on all interactions
- Back-to-top button with smooth scroll
- Unit toggle (°C / °F) with animated transition

### Premium Features
- Dynamic favicon showing current temperature
- Dynamic browser title
- Weather quotes that rotate every 30 seconds
- Favorite cities with localStorage persistence
- Recent search history
- Offline detection banner
- PWA support (installable, offline caching)

### Search
- Debounced city search with autocomplete
- Keyboard navigation (arrow keys, Enter, Escape)
- Open-Meteo geocoding API (free, no API key)
- Click-outside to close

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Axios | HTTP client |
| Lucide React | Icons |
| Recharts | Charts |
| React Hot Toast | Notifications |
| Context API | State management |

### APIs
- [Open-Meteo](https://open-meteo.com/) — Weather data (free, no key)
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) — Geocoding (free, no key)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/atmos.git
cd atmos

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
atmos/
├── public/
│   ├── icons/              # PWA icons
│   ├── favicon.svg         # Dynamic favicon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
├── src/
│   ├── api/                # API service layer
│   │   ├── weatherService.js
│   │   └── geocodingService.js
│   ├── components/
│   │   ├── cards/          # Detail cards
│   │   ├── forecast/       # Hourly, daily, chart
│   │   ├── hero/           # Main temperature display
│   │   ├── layout/         # Header/Navbar
│   │   ├── search/         # Search + favorites
│   │   ├── sky/            # 9-layer sky engine
│   │   └── ui/             # Reusable primitives
│   ├── context/            # React Context providers
│   ├── data/               # Static data (quotes)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component
│   ├── index.css           # Global styles + Tailwind
│   └── main.jsx            # Entry point
└── README.md
```

---

## Architecture

### Sky Engine
The sky engine renders 9 compositing layers based on weather conditions and time of day:
1. Sky gradient background
2. Star field
3. Sun or Moon
4. Clouds (parallax)
5. Rain / Snow
6. Lightning
7. Fog
8. Particles
9. Depth overlay

All transitions use Framer Motion's `AnimatePresence` for smooth state changes.

### Data Flow
```
Geolocation/Open-Meteo API → WeatherContext → Components
                                    ↓
                            getSkyConfig() → SkyEngine
```

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## License

MIT
