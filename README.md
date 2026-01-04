# Nest React Next Monorepo

A full-stack monorepo using **pnpm workspaces** with:
- **NestJS** API backend
- **Next.js** Web application
- **Vite + React** Admin dashboard

## 📦 Project Structure

```
├── apps/
│   ├── api/          # NestJS Backend API
│   ├── web/          # Next.js Web App
│   └── admin/        # Vite + React Admin Dashboard
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   └── react-shared/ # Shared React components & hooks
└── tools/
    └── generators/   # Code generators
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install all dependencies
pnpm install
```

### Environment Setup

```bash
# Copy environment files
cp apps/api/.env-example apps/api/.env
```

## 🏃 Running Applications

### Development Mode

```bash
# Run API server
pnpm api dev

# Run Web app
pnpm web dev

# Run Admin dashboard
pnpm admin dev
```

### Alternative: Direct commands

```bash
# Run API directly
pnpm -C apps/api dev

# Run Web directly
pnpm -C apps/web dev

# Run Admin directly
pnpm -C apps/admin dev
```

## 🔨 Build

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm api build
pnpm web build
pnpm admin build
```

## 🌱 Database Seeding

```bash
# Run seeders
pnpm api seed

# Run seeders with refresh (drops and recreates data)
pnpm api seed:refresh
```

## 🧪 Testing & Linting

```bash
# Run all tests
pnpm test

# Run linting across all packages
pnpm lint
```

## 📦 Update ACK+ Packages

```bash
# Update all @ackplus packages to latest
pnpm update-ackplus
```

---

## 🚀 Bulk CRUD Generation

This project includes a powerful bulk CRUD generation system that allows you to define multiple entities and generate full-stack CRUD operations from a single configuration file.

### Quick Start

1. **Copy the example configuration**:
   ```bash
   cp crud.config.example.json crud.config.json
   ```

2. **Edit the configuration** to define your entities, columns, and relationships

3. **Generate all entities**:
   ```bash
   # Generate all entities from config
   pnpm run g:crud-bulk

   # Or generate specific entities
   pnpm run g:crud-bulk -- --entities=product,category

   # Preview what will be generated
   pnpm run g:crud-bulk -- --dryRun=true

   # Handle conflicts automatically
   pnpm run g:crud-bulk -- --conflictResolution=skip    # Skip existing
   pnpm run g:crud-bulk -- --conflictResolution=update  # Overwrite existing
   pnpm run g:crud-bulk -- --conflictResolution=backup  # Update with backup
   ```

### Features

- **📋 Configuration-driven**: Define all entities in a single JSON file
- **🔄 Bulk generation**: Generate multiple CRUD operations at once
- **🎯 Selective generation**: Generate specific entities only
- **🔍 Validation**: Comprehensive config validation with helpful error messages
- **⚡ Conflict resolution**: Smart handling of existing files with multiple options
- **📊 Relationships**: Support for belongsTo, hasMany, and manyToMany relationships
- **🎨 UI customization**: Configure table styles, forms, and interactions
- **🔒 Permissions**: Role-based access control configuration
- **📱 Responsive**: Mobile-friendly generated components
- **🔧 Extensible**: Support for custom validators and features

### Documentation

For detailed documentation, see:
- [BULK_CRUD_GENERATION.md](./BULK_CRUD_GENERATION.md) - Complete guide
- [crud.config.example.json](./crud.config.example.json) - Example configuration

### Example Usage

```bash
# Generate a simple task management system
pnpm run g:crud-bulk

# Generate e-commerce entities
pnpm run g:crud-bulk -- --entities=product,category,order

# Use custom config file
pnpm run g:crud-bulk -- --configFile=my-project.config.json

# Update existing entities with backup
pnpm run g:crud-bulk -- --conflictResolution=backup --createBackup=true

# Non-interactive mode
pnpm run g:crud-bulk -- --interactive=false --conflictResolution=update
```

## 🛠️ Individual CRUD Generation

For generating individual entities:

```bash
# Generate single CRUD entity
pnpm run g:crud product

# With custom options
pnpm run g:crud product --features.softDelete=true --uiOptions.addEditMode=page
```

---

## 📚 Tech Stack

### Backend (API)
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Database

### Frontend (Web)
- [Next.js](https://nextjs.org/) - React framework
- [MUI](https://mui.com/) - Material UI components

### Admin Dashboard
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - UI library
- [MUI](https://mui.com/) - Material UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching

### Shared Packages
- `@libs/types` - Shared TypeScript interfaces
- `@libs/utils` - Common utility functions
- `@libs/react-shared` - Shared React components and hooks
