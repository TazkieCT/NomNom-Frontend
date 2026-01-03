# NomNom Frontend

A modern React-based web application for NomNom, a food marketplace platform that helps reduce food waste by connecting customers with stores offering surplus food deals at discounted prices.

## Features

### Landing Page
- Hero section with call-to-action
- How it works section
- Customer reviews and testimonials
- Available deals showcase
- Impact statistics
- About us section
- FAQ section

### User Authentication
- User registration and sign-in
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access (Customer/Seller)
- Profile management

### Marketplace
- Browse food deals from multiple stores
- Advanced filtering system:
  - Search by name
  - Filter by category
  - Filter by dietary preferences (Vegan, Vegetarian, Halal, Kosher)
  - Price range filter
  - Discount percentage filter
- Product detail pages with full information
- Interactive store map
- Real-time deal availability
- Skeleton loading states for better UX

### Customer Features
- View and purchase discounted food items
- Apply coupon codes to orders
- Order history and tracking
- Submit store reviews and ratings
- Rate the app and provide feedback
- View store locations on interactive maps
- Save favorite stores

### Seller Features
- Apply to become a seller
- Create and manage store profiles
- Add, edit, and delete food products
- Set pricing, discounts, and expiry dates
- Manage product inventory
- View and manage orders
- Dashboard with sales analytics
- Track customer reviews

### Dashboard
- Sales overview and analytics
- Order management interface
- Product performance tracking
- Revenue charts and statistics
- Quick actions for store management

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Hamburger menu for mobile navigation

### UI/UX Features
- Smooth animations with Framer Motion
- Loading skeletons for better perceived performance
- Toast notifications for user actions
- Modal dialogs for filters and actions
- Interactive data visualizations with Recharts
- Icon library with Lucide React

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see NomNom-Backend)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TazkieCT/NomNom-Frontend.git
cd NomNom
```

2. Install dependencies:
```bash
npm install
```

3. Copy .env.example to .env in the root directory, then adjust the environment variables as required:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## Project Structure

```
NomNom/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── components/        # Reusable React components
│   │   ├── marketplace/   # Marketplace-specific components
│   │   ├── header.tsx     # Navigation header
│   │   ├── footer.tsx     # Footer component
│   │   └── ...
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── data/              # Static data and sample data
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── Marketplace.tsx # Product marketplace
│   │   ├── Dashboard.tsx  # Seller dashboard
│   │   ├── SignIn.tsx     # Authentication pages
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── api.ts         # API client
│   │   └── auth.ts        # Authentication utilities
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## API Integration

The frontend communicates with the NomNom Backend API. Configure the API URL in the `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

All API calls are handled through the `utils/api.ts` module, which includes:
- JWT token management
- Request/response interceptors
- Error handling
- Authentication headers
