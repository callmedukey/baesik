# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Baesik (준푸드) is a school meal management system built with Next.js 14. It enables students to order meals, manage payments, and allows school administrators to oversee the meal service operations. The system supports multiple user roles: students, school administrators, and system administrators.

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npx prisma generate          # Generate Prisma client
npx prisma db push          # Push schema changes to database
npx prisma migrate dev      # Create and apply migrations
npx prisma studio           # Open Prisma Studio GUI
npx prisma db seed          # Run database seed script

# Start required services (PostgreSQL and Redis)
docker-compose up -d

# Stop services
docker-compose down
```

## Architecture Overview

### Authentication System
- Custom JWT-based authentication using jose library (not NextAuth despite the dependency)
- Session management via encrypted cookies with 24-hour expiration
- Three user types: Admin, Student, School Staff
- Middleware enforces role-based access control in middleware.ts
- Authentication actions in `/actions/session.ts` and various auth-related server actions

### Database Architecture
- PostgreSQL database with Prisma ORM
- Key models: Student, School, Admin, Menu, Meal, PaymentRecord, RefundRecord
- Meal ordering system tracks lunch/dinner selections per student
- Payment integration with external payment gateway (PayAction)
- Redis for caching/session storage

### Server Actions Pattern
The codebase extensively uses Next.js server actions organized by domain:
- `/actions/auth/` - Authentication operations
- `/actions/schools/` - School management
- `/actions/students/` - Student operations
- `/actions/meals/` - Meal ordering and management
- `/actions/payments/` - Payment processing
- `/actions/refunds/` - Refund handling

### Multi-tenant Architecture
- Schools are isolated tenants with their own students and meal data
- School staff can only access their school's data
- System admins have global access
- Student-School relationships managed via `studentSchoolRelations` table

### Payment Flow
1. Students add funds to their account via PayAction payment gateway
2. Meal orders deduct from student balance
3. Refunds available for cancelled meals before cutoff time
4. Payment webhooks handled in `/app/api/payments/webhook/route.ts`

### Key Business Rules
- Meal ordering cutoff: 8 PM the day before
- Refund cutoff: 8 PM the day before
- Holidays affect meal availability (tracked in Holidays table)
- Students can belong to multiple schools
- Meal pricing configurable per school

## Development Guidelines

### State Management
- Use server components by default
- Client components only when necessary for interactivity
- Form handling via react-hook-form with zod validation
- Server actions for all data mutations

### UI Components
- Radix UI primitives wrapped in `/components/ui/`
- Consistent use of shadcn/ui patterns
- TailwindCSS for styling
- Responsive design required

### Error Handling
- Server actions return `{ success: boolean, error?: string, data?: any }`
- Use toast notifications for user feedback
- Validate all inputs with zod schemas

### Performance Considerations
- Database connection pooling configured
- Redis caching for frequently accessed data
- Optimistic updates where appropriate
- Image optimization via Next.js Image component

## Environment Setup

Required environment variables:
- `SECRET` - JWT encryption key
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAPI_KEY` - External API key for meal data
- `PAYACTION_*` - Payment gateway credentials
- `SOLAPI_*` - SMS service credentials

## Testing Approach

Currently no automated tests. When implementing:
- Unit tests for server actions
- Integration tests for API routes
- E2E tests for critical user flows (meal ordering, payments)

## Deployment Considerations

- Database migrations must be run before deployment
- Redis required for production
- Environment variables must be properly configured
- Consider connection limits for PostgreSQL
- Payment webhook URL must be configured in PayAction dashboard