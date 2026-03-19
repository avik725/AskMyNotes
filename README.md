# AskMyNotes

AskMyNotes is an AI-powered note-taking and Q&A platform that lets you upload notes and interact with them using a RAG (Retrieval-Augmented Generation) based AI chatbot.

🌐 **Live at** → [askmynotes.online](https://askmynotes.online)

---

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React 18, Vite, Redux Toolkit, TipTap Editor         |
| Backend  | Node.js, Express 5, Mongoose, LangChain, OpenAI      |
| Database | MongoDB (+ Atlas Vector Search)                      |
| Queue    | BullMQ, Redis                                        |
| Storage  | Cloudinary                                           |

---

## Github Repository

```bash
https://github.com/avik725/AskMyNotes.git
```

## Prerequisites

- **Node.js** ≥ 18
- **Redis** (running locally or via Docker)
- **MongoDB** instance (Only MongoDB Atlas can be used)

---

## Getting Started (Development)


### 1. Start the Backend server:

```bash
cd server
npm install
npm run dev
```

In a separate terminal, start the BullMQ worker:

```bash
cd server
npm run worker:dev
```

### 3. Start the Frontend server

```bash
cd client
npm install
```


Start the Vite dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Running with Docker

You can also spin up the entire stack using Docker Compose:

```bash
# Copy and configure the docker env file
cp server/.env.docker.sample server/.env

# Start all services
docker compose up --build
```

This will start the **frontend** (port 3000), **backend**, **worker**, and **Redis** containers.

---

## Project Structure

```
AskMyNotes/
├── client/      # React + Vite frontend
├── server/      # Express backend + BullMQ workers
└── docker-compose.yml
```

---
