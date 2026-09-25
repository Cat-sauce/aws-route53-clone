```markdown
# AWS Route 53 Management Console Clone

A full-stack replica of the Amazon Route 53 DNS management console. The application includes a public AWS marketing landing portal, an IAM-style sign-in workflow, and an AWS Cloudscape-inspired console dashboard to manage hosted zones and DNS record sets.

---

## Live Deployments

- **Frontend (Vercel):** https://aws-route53-clone-orpin.vercel.app
- **Backend (Render):** https://aws-route53-clone-gctk.onrender.com
- **API Documentation (Swagger UI):** https://aws-route53-clone-gctk.onrender.com/docs

---

## Architecture Flow


```

[ User Browser ]
|
v
[ Next.js Frontend (Vercel) ]
|-- Public Portal (/)
|-- Authentication Mock (/signin)
|-- Hosted Zones Console (/console)
`-- Record Set Manager (/hosted-zones/[zoneId]) | | REST API (JSON / CORS) v [ FastAPI Backend (Render) ] |-- Routers (/api/hosted-zone, /api/records) |-- Validation (Pydantic Schemas) |-- Auto-generation (NS & SOA on zone creation) `-- ORM (SQLAlchemy)
|
v
[ SQLite Database (route53.db) ]

```

---

## Key Features

- **Public Marketing Page:** Landing page styled after the official AWS Route 53 product overview.
- **Console Interface:** Navigation bar, sidebar, and data tables matching the AWS Cloudscape design system.
- **Hosted Zone Management:** Full CRUD operations for public and private hosted zones with automatic NS and SOA record creation.
- **DNS Record Configuration:** Support for standard resource record types (A, AAAA, CNAME, TXT, MX, NS, SOA) along with routing policy configurations (Simple, Weighted).
- **BIND Zone File Export:** Export record sets directly into standard RFC-compliant BIND zone format.
- **Authentication State:** Client-side IAM session persistence.

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI, Python 3.11+, SQLAlchemy, Pydantic, Uvicorn
- **Database:** SQLite
- **Hosting:** Vercel (Frontend), Render (Backend Web Service)

---

## Local Development

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000

```

The API will be available at `http://127.0.0.1:8000` and interactive docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create local environment config
echo "NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)" > .env.local

npm run dev

```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

### Frontend (`frontend/.env.local` or Vercel Settings)

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend | `https://aws-route53-clone-gctk.onrender.com` |

---

## API Endpoints Overview

* `GET /health` - Health check status
* `GET /api/hosted-zone` - List hosted zones (supports search filtering)
* `POST /api/hosted-zone` - Create a new hosted zone
* `DELETE /api/hosted-zone/{id}` - Delete a hosted zone and its associated records
* `GET /api/hosted-zone/{id}/records` - List records within a zone
* `POST /api/hosted-zone/{id}/records` - Create a DNS record
* `DELETE /api/hosted-zone/{id}/records/{record_id}` - Delete a DNS record

```

```
