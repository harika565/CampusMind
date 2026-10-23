# CampusMind — Frontend Web Application

CampusMind is an AI-powered intelligent campus assistant built with React, TypeScript, Vite, and Tailwind CSS. The application connects students, faculty members, and university administrators to institutional knowledge through a conversational interface powered by Retrieval-Augmented Generation (RAG).

---

## 1. Architecture & Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling & Design System:** Tailwind CSS customized with academic enterprise tokens inspired by Linear & Notion
- **Routing:** React Router v7 with protected route hierarchy and role-based guards
- **Server State Management:** TanStack Query (React Query v5)
- **HTTP Client:** Centralized Axios instance with Bearer JWT interceptors and standardized `ApiError` parsing
- **Icons:** Lucide React
- **Markdown Rendering:** React Markdown for grounded response formatting
- **Testing:** Vitest + React Testing Library + jsdom

---

## 2. Implemented Modules

| Module | Route | Access Scope | Description |
|---|---|---|---|
| **Landing Page** | `/` | Public | Public portal showcasing hero architecture, RAG features, 3-step workflow, categories, and institutional privacy |
| **Authentication** | `/login` | Public | Secure login with password reveal, quick demo credentials fill, and error diagnostics |
| **Registration** | `/register` | Public | Self-registration for students & faculty with role-based restriction (admin disallowed from self-service) |
| **Student Dashboard** | `/app/dashboard` | Student | Personalized overview, AI inquiry bar, suggested prompt chips, recent conversations, and knowledge category links |
| **Faculty Dashboard** | `/faculty/dashboard` | Faculty | Tailored portal featuring research grant guidelines, curriculum outlines, and academic regulations |
| **Administrator Dashboard** | `/admin/dashboard` | Admin | High-level metrics (total, indexed, processing, failed documents), telemetry, and recent ingestion activities |
| **AI Chat Interface** | `/app/chat` | Authenticated | High-performance conversational assistant with real-time prompt streaming, grounded citations, and history drawer |
| **Conversation History** | `/app/history` | Authenticated | Complete searchable conversation history log with deletion and resumption capabilities |
| **Document Repository** | `/admin/documents` | Admin | Comprehensive tabular document viewer with search, category filtering, audience filtering, and status badges |
| **Document Ingestion** | `/admin/documents/upload` | Admin | Drag-and-drop document uploader with PDF/DOCX/TXT validation, 25MB limit, and ingestion progress indicator |
| **User Directory** | `/admin/users` | Admin | Directory of enrolled students, faculty members, and administrative staff |
| **System Telemetry Logs** | `/admin/logs` | Admin | Live diagnostics log viewer with severity filtering (INFO, WARN, ERROR) and service tracking |
| **Profile & Settings** | `/app/profile` | Authenticated | User account details, role badge, department information, and Development Mock Mode toggle |
| **Unauthorized Guard** | `/unauthorized` | Authenticated | Access-denied screen preventing unauthorized role traversal |

---

## 3. Development Mock Mode & Demo Accounts

CampusMind includes an isolated **Development Mock Service** enabled by default for offline evaluation and preview. It simulates realistic RAG queries, response citations, document uploads, and asynchronous indexing without external API costs.

### Pre-Configured Demo Credentials:
- **Student Account:** `student@university.edu` / `Password123!` (Alex Morgan — Computer Science)
- **Faculty Account:** `faculty@university.edu` / `Password123!` (Dr. Evelyn Chen — Computing & Data Science)
- **Admin Account:** `admin@university.edu` / `Password123!` (Marcus Vance — Academic Registrar)

> **Note:** Use the quick-fill buttons on `/login` or the **Mock Demo Mode** pill in the top header to instantly switch roles at any time.

---

## 4. Environment Configuration

Create a `.env` file in the `frontend` root:

```env
# URL for the live RAG backend server
VITE_API_BASE_URL=http://localhost:8000

# Set to 'false' to connect directly to the real backend APIs
VITE_USE_MOCKS=false
```

---

## 5. Getting Started

### Install Dependencies:
```bash
npm install --legacy-peer-deps
```

### Run Local Development Server:
```bash
npm run dev
```
The server will start at `http://localhost:5173/`.

### Run Test Suite:
```bash
npm test
```
Executes all unit and integration tests using Vitest and React Testing Library.

### Build Production Bundle:
```bash
npm run build
```
Generates minified static assets in `dist/`.

---

## 6. Backend Integration Contracts

For Person 2 (Backend / RAG Engineer), the frontend integrates with the following REST endpoints:

- `POST /api/auth/login`: Authenticate credentials, return `{ access_token, token_type, user }`
- `POST /api/auth/register`: Register new student/faculty account
- `GET /api/auth/me`: Retrieve current authenticated user profile
- `POST /api/chat/query`: Submit question, return `{ answer, conversation_id, message_id, citations, retrieval_metadata }`
- `GET /api/chat/conversations`: List user conversation threads
- `GET /api/chat/conversations/:id/messages`: Retrieve messages for a specific conversation
- `DELETE /api/chat/conversations/:id`: Delete a conversation thread
- `GET /api/documents`: List institutional documents with query parameters (`search`, `category`, `status`)
- `POST /api/documents/upload`: Multipart file upload (`file`, `title`, `category`, `audience`, `description`)
- `DELETE /api/documents/:id`: Delete document from catalog and vector index
- `GET /api/documents/:id/status`: Poll document chunking and vector embedding status
- `GET /api/admin/metrics`: Fetch dashboard telemetry and document ingestion counts
- `GET /api/admin/users`: List university users
- `GET /api/admin/logs`: Stream system diagnostic events
