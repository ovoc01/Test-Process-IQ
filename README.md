# Candidate Management System

A full-stack application built for the 24h assessment, demonstrating a robust testing strategy and modern development practices.

## Liens du Projet

- **Repository GitHub**: [Lien vers votre repo]
- **Application Déployée**: [Lien Render - ex: https://candidate-management.onrender.com]
- **Statut CI**: ![CI](https://github.com/votre-user/votre-repo/actions/workflows/ci.yml/badge.svg)

---

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB, Zod, JWT, PDFKit.
- **Frontend**: React, TypeScript, Vite, Styled Components, React Hook Form.
- **Testing**: Jest, Supertest, Vitest, MSW, Cypress, k6.
- **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## Instructions d'installation

### Prérequis

- Node.js 18+
- Docker & Docker Compose (optionnel)

### Installation Rapide (Docker)

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:5001`

### Installation Manuelle

1. **Root**: `npm install`
2. **Backend**:
   - `cd backend && npm install`
   - Configurer `.env` (Port 5001 recommandé sur macOS)
   - `npm run dev`
3. **Frontend**:
   - `cd frontend && npm install`
   - `npm run dev`

---

## Stratégie de Tests Détaillée

### 1. Tests Unitaires (Back & Front)

- **Backend**: Validation des modèles Mongoose et de la logique métier (Jest).
- **Frontend**: Tests des hooks personnalisés (useAuth) et des utilitaires (Vitest).
- **Objectif**: 100% de couverture sur les chemins critiques.

### 2. Tests d'Intégration

- **Backend**: Tests des endpoints API avec Supertest et une base de données MongoDB en mémoire (`mongodb-memory-server`).
- **Frontend**: Simulation des appels API avec **MSW (Mock Service Worker)** pour tester les composants en isolation sans backend réel.

### 3. Tests E2E (Cypress)

Scénario automatisé :

- Connexion Admin.
- Création d'un candidat avec validation des champs.
- Consultation du détail et lancement de la validation asynchrone.
- Suppression du candidat (Soft delete).

### 4. Tests de Performance (k6)

Simulation de charge : 500 requêtes sur l'endpoint de création.

- Validation des seuils de latence (P95 < 500ms).
- Analyse du taux d'erreur sous forte charge.

### 5. Tests de Sécurité

- Protection contre les injections NoSQL via Zod.
- Rate limiting sur l'authentification pour prévenir le brute-force.
- Headers de sécurité Helmet.

---

## Rapports

### Rapport de Couverture (Backend)

| File       | % Stmts | % Branch | % Funcs | % Lines |
| ---------- | ------- | -------- | ------- | ------- |
| All files  | 70.05   | 45.09    | 66.66   | 68.36   |
| Models     | 100     | 100      | 100     | 100     |
| Middleware | 91.66   | 57.14    | 100     | 90.9    |

### Rapport de Performance (k6)

_Extrait des résultats types :_

- **Requests per second**: ~45 req/s
- **P95 Latency**: 120ms
- **Success Rate**: 100%

---

## Qualité Continue

- **Husky**: Pre-commit hooks lançant le Linting et les tests sur les fichiers modifiés.
- **GitHub Actions**: Pipeline CI automatisée exécutant les tests et vérifiant la qualité du code à chaque push.
