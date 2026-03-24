![CI Status](https://github.com/FatimahEdaly/webhook-pipeline/actions/workflows/ci.yml/badge.svg)

# ⚡ Webhook Pipeline - Task Processing Service

Webhook Pipeline is a backend automation service inspired by **Zapier**.
It allows users to create pipelines that receive webhook events, process them asynchronously using a background worker, and deliver results to subscriber endpoints.

Built with **TypeScript**, **Node.js**, **PostgreSQL**, **Docker**, and **GitHub Actions**.

---

# ✨ Features

* Pipeline CRUD API (create, update, delete pipelines)
* Webhook ingestion endpoint
* Background worker for asynchronous processing
* Multiple processing action types
* Subscriber delivery with retry logic
* Job status tracking API
* Delivery attempts history tracking
* PostgreSQL database integration
* Fully Dockerized setup
* CI/CD pipeline with GitHub Actions

---

# 📋 Prerequisites

Before running the project, ensure you have:

* Docker
* Docker Compose

(No local database setup required)

---

# 🚀 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/webhook-pipeline.git
cd webhook-pipeline
```

### 2️⃣ Start the application

```bash
docker compose up --build
```

This starts:

* PostgreSQL database
* API server
* Background worker

Server runs at:

```
http://localhost:3000
```

---

# 📡 API Usage

## Create Pipeline

```bash
POST /api/pipelines
```

Example:

```
{
  "action": "uppercase",
  "subscribers": [
    "https://webhook.site/example"
  ]
}
```

---

## Trigger Webhook

```bash
POST /webhook/:pipelineId
```

Example:

```
{
  "message": "hello world"
}
```

Response:

```
202 Accepted
```

Creates a background processing job.

---

## Get Jobs Status

```bash
GET /api/jobs
```

Returns:

```
pending
processing
completed
failed
```

---

## Get Delivery Attempts

```bash
GET /api/jobs/:jobId/attempts
```

Returns retry history for subscriber deliveries.

---

# 🏗️ Architecture

System components:

### API Server

Handles:

* pipeline management
* webhook ingestion
* job tracking

---

### Worker Service

Handles:

* polling pending jobs
* executing processing actions
* delivering results to subscribers
* retrying failed deliveries

---

### PostgreSQL Database

Stores:

* pipelines
* jobs
* subscribers
* delivery attempts
* migrations metadata

---

# 🐳 Running With Docker

Start services:

```bash
docker compose up --build
```

Runs:

```
PostgreSQL
API Server
Worker Service
```

Ensures consistent environment across systems.

---

# 🔄 Database Migrations

Run manually:

```bash
npm run migrate
```

Automatically executed during container startup.

---

# 🧪 Running Tests

Execute:

```bash
npm run test
```

Runs unit and integration tests with coverage reporting.

---

# ⚙️ Design Decisions

### Why asynchronous processing?

Webhook requests are queued instead of processed immediately to:

* avoid blocking API requests
* improve performance
* support retry logic
* enable scalable architecture

---

### Why worker-based architecture?

Separating API and worker services:

* improves reliability
* supports background processing
* allows scaling workers independently

---

### Why Docker?

Docker ensures:

* easy setup
* consistent environments
* reproducible builds

---

# 👩‍💻 Author

**Fatimah Jalal**

Computer Science Student
Backend Developer in Training 🚀
