# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core commands
- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production (runs TypeScript check then Vite build)
- `pnpm lint` - Run ESLint on the codebase
- `pnpm preview` - Preview production build locally

### Package manager
This project uses **pnpm** as the package manager. The `vercel.json` is configured for pnpm installs.

## Architecture Overview

### Tech Stack
- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **TanStack Query (React Query)** for server state management
- **Tailwind CSS v4** with Vite plugin
- **Radix UI** primitives for accessible UI components
- **React Hook Form** for form management
- **Sonner** for toast notifications

### Application Structure

The app is a **POS (Point of Sale) system** with role-based access control:
- **Roles**: `salesperson`, `manager`, `admin`
- Navigation and features are filtered by user role via `src/components/sidebar.tsx`

#### Main entry points
- `src/main.tsx` - App initialization with QueryClient and AuthProvider
- `src/App.tsx` - Main layout with sidebar routing and mobile responsive header

#### Data layer
- **Mock mode**: Enabled by default via `VITE_USE_MOCKS` env var (defaults to `true`)
- **Real API**: When mocks disabled, calls `http://localhost:3007/api`
- All API calls go through `src/lib/api.ts` which handles both mock and real modes
- Mock data and mutation logic in `src/lib/mock-data.ts`

#### State management
- **Auth**: `src/contexts/AuthContext.tsx` - User authentication and role management
- **Server state**: TanStack Query via hooks in `src/hooks/useApi.ts`
- **Forms**: React Hook Form hooks in `src/hooks/useApi.ts`

#### Path aliases (configured in `vite.config.ts`)
```typescript
@/           → ./src
@components  → ./src/components
@pages       → ./src/pages
@stores      → ./src/stores
@types       → ./src/types
@lib         → ./src/lib
@assets      → ./src/assets
@providers   → ./src/providers
```

### Component Architecture

#### UI Components (`src/components/ui/`)
Radix UI + Tailwind components following shadcn/ui patterns:
- `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `select.tsx`
- `dialog.tsx`, `badge.tsx`, `alert.tsx`, `separator.tsx`
- `table.tsx`

#### Feature Components
Each is a self-contained page/component:
- `dashboard.tsx` - Stats overview for managers/admins
- `sales-interface.tsx` - Point of sale interface
- `product-management.tsx` - Product CRUD
- `supplier-management.tsx` - Supplier CRUD
- `supplier-product-management.tsx` - Managing supplier-product relationships (supply pricing)
- `staff-management.tsx` - Staff CRUD with role/status management
- `invoices.tsx` - Invoice management
- `transactions.tsx` - Transaction history
- `reports.tsx` - Sales/inventory reports
- `login.tsx` - Login page (auto-logs in when mock mode enabled)

### API Layer Details

The `src/lib/api.ts` file contains:
1. **Mock API handler** (`mockApiRequest`) - Routes requests to mock data functions
2. **Real API handler** (`apiRequest`) - Makes actual fetch calls to backend
3. **Typed API methods** (`api.get`, `post`, `put`, `delete`, `patch`)
4. **Endpoint definitions** (`endpoints` object) - Centralized route strings
5. **TypeScript types** - All request/response interfaces

The mock system supports full CRUD operations and persists in memory during the session. When adding new features, you typically need to:
1. Add types to `api.ts`
2. Add mock data/functions to `mock-data.ts`
3. Add routes to the `mockApiRequest` function
4. Add hooks to `useApi.ts`

### Key Patterns

#### TanStack Query usage
```typescript
// Query
const { data, isLoading, error } = useProducts(page, limit)

// Mutation with invalidation
const createMutation = useCreateProduct()
createMutation.mutate(data, { onSuccess: () => { ... } })
```

#### Form handling
```typescript
const { register, handleSubmit, formState: { errors } } = useProductForm()
```

#### Navigation
Uses custom events for cross-component navigation:
```typescript
window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'sales' }))
```

#### Mock mode behavior
When `VITE_USE_MOCKS=true`:
- Login bypasses auth, auto-logs in as `mockUser` (Alex Doe, manager)
- Logout preserves the mock session (doesn't actually log out)
- All mutations work in-memory only (resets on refresh)

### TypeScript Configuration
- Project references with `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Strict mode enabled
- Path aliases configured for `@/*` imports

### ESLint
Uses `typescript-eslint` with:
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-react-refresh` - Vite HMR optimization
- Ignores `dist/` directory
