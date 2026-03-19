# shortener-api

REST API for URL shortening built with NestJS and PostgreSQL. Allows creating, retrieving, updating and deleting short URLs, as well as tracking the access count for each one.

## Project Structure

```
shortener-api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root application module
│   ├── app.controller.ts          # Root application controller
│   ├── app.service.ts             # Root application service
│   └── api/                      # Api domain module
│       ├── entities/
│       │   └── short.entity.ts     # Short entity and DTOs
│       ├── infra/
│       │   └── database.ts         # Prisma client setup
│       ├── repositories/
│       │   └── shorten.repository.ts # Data access layer
│       ├── services/
│       │   └── shorten.service.ts    # Business logic layer
│       ├── controllers/
│       │   └── shorten.controller.ts # API request handling layer
│       └── shorten.module.ts         # Shorten module configuration
├── prisma/
│   └── schema.prisma              # Prisma schema (Short model)
├── generated/
│   └── prisma/                    # Prisma generated client
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── docker-compose.yml             # Docker compose all services (API + PostgreSQL)
├── docker-compose.dependencies.yml # Docker compose services (PostgreSQL)
├── Dockerfile                     # Docker container
├── nest-cli.json                  # NestJS CLI configuration
└── README.md                      # Project documentation
```

## Architecture Layers

### 1. **Entity Layer** (`short.entity.ts`)
- Defines the Short interface and Data Transfer Objects (DTOs)
- Contains data structure definitions

### 2. **Infrastructure Layer** (`infra/database.ts`)
- Initializes and exports the Prisma client
- Uses `@prisma/adapter-pg` for PostgreSQL connection via `DATABASE_URL`

### 3. **Repository Layer** (`shorten.repository.ts`)
- Handles data persistence and retrieval
- Implements CRUD operations

### 4. **Service Layer** (`shorten.service.ts`)
- Contains business logic
- Validates data and enforces business rules
- Acts as an intermediary between controller and repository

### 5. **Controller Layer** (`shorten.controller.ts`)
- Handles HTTP requests and responses
- Defines API endpoints and routing
- Validates input parameters

## Short Entity

Prisma model (`prisma/schema.prisma`):

```prisma
model Short {
  id          Int      @id @default(autoincrement())
  url         String
  shortCode   String   @unique @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())
  accessCount Int      @default(0)
}
```

TypeScript classes:

```typescript
class ShortResponse {
  id: string;
  url: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

class Short extends ShortResponse {
  accessCount: number;
}
```

## API Endpoints

### General
- `GET /health` - Health check

### Endpoints
- `POST /shorten` - Create a new short url
- `GET /shorten/:shortCode` - Get short by short code
- `GET /shorten/:shortCode/stats` - Get stats
- `PUT /shorten/:shortCode` - Update a short
- `DELETE /shorten/:shortCode` - Delete a short

### Swagger UI

Interactive API documentation is available at `http://localhost:3000/docs`.

## Sample API Usage

### Create a short
```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "http://www.google.com"}'
```

### Update a short
```bash
curl -X PUT http://localhost:3000/shorten/<shortCode> \
  -H "Content-Type: application/json" \
  -d '{"url": "http://www.google.com"}'
```

### Delete a short
```bash
curl -X DELETE http://localhost:3000/shorten/<shortCode>
```

### Get a short stats
```bash
curl -X GET http://localhost:3000/shorten/<shortCode>/stats
```

## Installation and Setup

Copy the environment file and adjust the values if needed:
```bash
cp .env.example .env
```

### Local

1. Install dependencies:
```bash
npm install
```

2. Start service dependencies (PostgreSQL):
```bash
docker-compose -f docker-compose.dependencies.yml up -d
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Start the application in development mode:
```bash
npm run start:dev
```

### Docker

1. Build and start all services (API + PostgreSQL):
```bash
docker compose up --build
```

The API will be available at `http://localhost:3000` and PostgreSQL at `localhost:5432`.

## Available Scripts

### Application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application

### Prisma
- `npm run prisma:migrate` - Run database migrations (dev)
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:reset` - Reset database and re-run migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Tests
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
