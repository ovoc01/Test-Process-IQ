# Candidate Management System

A full-stack application built for the 24h assessment, demonstrating a robust testing strategy and modern development practices.

[![CI](https://github.com/your-username/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/your-repo/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/your-username/your-repo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/your-repo)

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Zod, JWT, PDFKit.
- **Frontend**: React, TypeScript, Vite, Styled Components, React Hook Form, Axios, Lucide React.
- **Testing**: Jest, Supertest, Vitest, MSW, Cypress, k6.
- **DevOps**: Docker, Docker Compose, GitHub Actions, Husky.

## Prerequisites

- Node.js 18+
- MongoDB (local or via Docker)
- Docker & Docker Compose (optional)

## Installation

1. Clone the repository.
2. Install dependencies from the root:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (see `backend/.env` for template).

## Running the Application

### Development Mode

Run both backend and frontend concurrently:
```bash
# In the root
npm run dev:backend
npm run dev:frontend
```

### Docker Mode

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost` and the backend at `http://localhost:5000`.

## Testing Strategy

### Unit & Integration Tests

```bash
# Backend
cd backend && npm run test:coverage

# Frontend
cd frontend && npm test
```

### E2E Tests (Cypress)

```bash
cd frontend && npx cypress run
```

### Load Testing (k6)

1. Install k6.
2. Run the script:
   ```bash
   k6 run load-test.js
   ```

### Security Testing

```bash
node security-test.js
```

## Features

- **Authentication**: JWT-based protection for all candidate routes.
- **Candidate CRUD**: Complete management with soft delete.
- **Async Validation**: Simulated 2s asynchronous validation process.
- **Document Generation**: PDF report generation for each candidate.
- **Responsive UI**: Built with Styled Components and modern React patterns.
- **Security**: Rate limiting, NoSQL injection protection (via Zod/Mongoose), and helmet headers.
- **CI/CD**: Automatic testing and linting on every push via GitHub Actions.
- **Quality**: Pre-commit hooks for linting, type checking, and unit tests.
