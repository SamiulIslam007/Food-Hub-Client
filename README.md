<div align="center">

# Food Hub Client

**Modern food delivery frontend built with Next.js 16**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## Overview

Food Hub is a multi-vendor food delivery platform that connects customers with local restaurants.
This repository contains the frontend app, including separate experiences for customers, providers, and admins.

## Key Features

### Role-Based Portals
- **Admin Dashboard**: Overview, user management, provider approvals, and platform stats
- **Provider Dashboard**: Meal management, order handling, status updates, and profile management
- **Customer Portal**: Browse meals, filters/search, cart, checkout, and order history

### Technical Highlights
- **Next.js App Router** for routing and page structure
- **Type-safe codebase** with TypeScript
- **Form handling and validation** via React Hook Form + Zod
- **Responsive UI** using Tailwind CSS v4
- **User feedback** with Sonner toasts

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Data Fetching**: Axios
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- Food Hub backend server running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SamiulIslam007/Food-Hub-Client.git
cd Food-Hub-Client
```

2. Install dependencies:
```bash
npm install
```

3. Create an environment file in the root directory (`.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev    # start development server
npm run build  # build for production
npm run start  # run production build
npm run lint   # run lint checks
```

## Project Structure

```text
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (dashboard)/      # Role-based dashboards (admin, customer, provider)
│   ├── meals/            # Public meal browsing
│   └── providers/        # Public restaurant browsing
├── components/           # Reusable UI components
│   ├── modules/          # Feature-specific components
│   └── shared/           # Global components (Navbar, Footer, AuthGuard)
├── config/               # Global configuration
├── context/              # React Context (AuthContext)
├── lib/                  # Utility functions (axios instance)
├── services/             # API integration services
└── types/                # TypeScript interfaces and types
```

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit --trailer "Made-with: Cursor" -m "Add some AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

No license file is currently included in this repository.