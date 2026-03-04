# Todo App – Conteneurisation Docker

Application full stack (React + Node.js + PostgreSQL) conteneurisée avec Docker et Docker Compose.

## Architecture

```
Internet
   │
   ▼
[Frontend – React/Nginx] ←── frontend-network ──→ [Backend – Node.js/Express]
   (port 80 exposé)                                        │
                                                  backend-network
                                                           │
                                                 [Database – PostgreSQL]
                                                 (volume: postgres-data)
```

### Services

| Service    | Image              | Réseau(x)                         | Port exposé |
|------------|--------------------|-----------------------------------|-------------|
| `db`       | postgres:16-alpine | backend-network                   | —           |
| `backend`  | custom Node.js     | backend-network, frontend-network | —           |
| `frontend` | custom Nginx+React | frontend-network                  | 80          |

### Volumes
- `postgres-data` : persistance des données PostgreSQL

### Réseaux
- `frontend-network` : communication frontend ↔ backend
- `backend-network` : communication backend ↔ database (isolé)

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.0

---

## Démarrage

### 1. Cloner le dépôt
```bash
git clone https://github.com/<votre-repo>/docker-todo-app.git
cd docker-todo-app
```

### 2. Configurer les variables d'environnement
```bash
cp .env.example .env
```

### 3. Lancer l'application
```bash
docker compose up -d --build
```

### 4. Accéder à l'application
Ouvrir http://localhost

### 5. Arrêter
```bash
docker compose down
```

---

## Commandes utiles

```bash
docker compose logs -f
docker compose logs -f backend
docker compose ps
docker exec -it todo_backend sh
docker exec -it todo_db psql -U todouser -d tododb
```

---

## Tester la communication entre conteneurs

```bash
curl http://localhost/api/health

curl http://localhost/api/todos

curl -X POST http://localhost/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test depuis curl"}'

docker exec -it todo_frontend wget -qO- http://backend:3000/api/health
```

---

## Tester la persistance des données

```bash
curl -X POST http://localhost/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test persistance"}'

docker compose down
docker compose up -d

curl http://localhost/api/todos

docker compose down -v
```

---

## Pousser les images sur Docker Hub

```bash
docker login

docker compose build

docker push <DOCKERHUB_USERNAME>/todo-frontend:latest
docker push <DOCKERHUB_USERNAME>/todo-backend:latest
```

---

## Liens

- Repository GitHub : https://github.com/<votre-repo>/docker-todo-app
- Docker Hub Frontend : https://hub.docker.com/r/<username>/todo-frontend
- Docker Hub Backend : https://hub.docker.com/r/<username>/todo-backend
