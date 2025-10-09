## Tech Stack | 기술 스택 | Pile technologique

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4, `tailwind-merge`, `clsx`, `class-variance-authority`
- Radix UI (`@radix-ui/*`), custom UI components, `lucide-react`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- UI/UX: `next-themes`, `sonner` (toasts), `react-day-picker`
- Carousel: `embla-carousel-react`, `embla-carousel-autoplay`
- Data/Utils: `date-fns`, `numeral`, `react-markdown`
- Firebase (Client SDK) for auth/db/storage
- Firebase Admin SDK on server for secure operations

## Features | 주요 기능 | Fonctionnalités

- Auth: Email/Password + Google Login, Register, Forgot Password
- Account: Profile update, password update, favourites, orders
- Catalogue: Properties/products list, detail pages, search/filter
- Cart & Checkout
- Reviews with ratings
- Admin Dashboard: Banners, Coupons, Properties CRUD, uploads

## Requirements | 사전 준비 | Prérequis

- Node.js 18+
- Firebase project (Web app + service account)

## Environment Variables | 환경 변수 | Variables d’environnement

Create a `.env.local` file in the project root.

Client SDK (public):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Admin SDK (server):
```bash
FIREBASE_PRIVATE_KEY_ID=...
FIREBASES_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
```

Note: The private key must preserve line breaks (escaped as `\n`).

## Development | 개발 | Développement

Install dependencies and start the dev server:
```bash
npm install
npm run dev
# or: yarn dev / pnpm dev / bun dev
```

Open `http://localhost:3000`.

## Build & Start | 빌드 & 시작 | Construire & démarrer
```bash
npm run build
npm start
```

## Configuration Notes | 구성 메모 | Notes de configuration

- Images: remote patterns configured for `lh3.googleusercontent.com` and `firebasestorage.googleapis.com` in `next.config.ts`.
- Dark mode: `next-themes` with `class` strategy; Tailwind `darkMode: 'class'`.
- Admin SDK is initialized once on server; ensure env vars are set in deployment.

## Scripts | 스크립트 | Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm start`: start production server
- `npm run lint`: run ESLint

## Directory Overview | 디렉터리 개요 | Aperçu des dossiers

- `app/`: App Router pages (auth, account, admin-dashboard, checkout, etc.)
- `components/`: UI components (navbar, forms, banners, carousel, etc.)
- `firebase/`: `client.ts` (Client SDK), `server.ts` (Admin SDK)
- `lib/`, `context/`, `types/`, `validation/`: utilities, state, schemas, types

## Deployment | 배포 | Déploiement

- This project was deployed using Vercel. Make sure to add the above environment variables.
- Ensure Firebase Admin credentials are set as secure environment variables.


## Prisma Integration for Payment System

This project uses **Prisma** as a type-safe ORM to handle payment-related data while continuing to use **Firebase** for authentication and product data. Here's a summary of the setup and work done:

### Setup

1. Installed Prisma dependencies:
   ```bash
   npm install prisma --save-dev
   npm install @prisma/client

2.	Initialized Prisma in the project:
    ```bash
    npx prisma init

3.	Configured the Prisma client with optional performance extensions: 
    lib/prisma.ts

4.	Defined the database schema (schema.prisma) to manage users, orders, and payments:
    prisma/schema.prisma 

5. data migration excution 
    ```bash
    npx prisma migrate dev --name init
6. test connection 
    ```bash 
    npx prisma studio
    go to http://localhost:5555 

if you can see the data table, it success!!