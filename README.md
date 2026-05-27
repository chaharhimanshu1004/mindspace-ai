# MindSpace

A calm, AI-native second brain — capture thoughts, let them find each other.

## Repos

| Repo | Role | Stack |
|---|---|---|
| `mindspace-be` | REST API — auth, data persistence, business logic | Node.js, Express, TypeScript, Prisma, PostgreSQL |
| `mindspace-ui` | Web client — all user-facing pages and interactions | Next.js 15, React, TypeScript, Tailwind CSS |
| `mindspace-ai-engine` | AI layer — embeddings, semantic search, recall | Python, FastAPI |

## Getting started

Copy `.env.example` to `.env` in each repo and fill in the values, then:

```bash
# backend
cd mindspace-be && npm install && npm run dev

# frontend
cd mindspace-ui && npm install && npm run dev

# ai engine
cd mindspace-ai-engine && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload
```
