# Banda Chao Docker Setup

## Services

This Docker Compose configuration includes:

1. **PostgreSQL** (port 5433) - Main database
2. **MongoDB** (port 27017) - Document store for analytics
3. **Redis** (port 6379) - Cache and session store
4. **API Backend** (port 3001) - Node.js/Express API
5. **Web Frontend** (port 3000) - Next.js application

## Quick Start

### Start all services:
```bash
cd docker
docker-compose up -d
```

### Start specific services:
```bash
docker-compose up -d postgres mongo redis
```

### View logs:
```bash
docker-compose logs -f
```

### Stop all services:
```bash
docker-compose down
```

### Rebuild services:
```bash
docker-compose up -d --build
```

## Service URLs

- Web: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5433
- MongoDB: localhost:27017
- Redis: localhost:6379

## Default Credentials

- PostgreSQL: banda / password
- MongoDB: banda / password
- Redis: password
