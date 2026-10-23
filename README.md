# CampusMind — AI-Powered Intelligent Campus Assistant

CampusMind helps students, faculty members, and administrators access institutional information through a conversational AI interface powered by Retrieval-Augmented Generation (RAG).

The system handles university regulations, academic calendars, examination notifications, syllabi, timetables, fee structures, placement information, campus policies, and other institutional documents.

---

## Workspace Structure

```text
c:\CampusMind\
├── frontend/             # Complete React 19 + TypeScript + Vite frontend
│   ├── public/           # Static assets, SVG favicon
│   ├── src/              # Application source code
│   │   ├── app/          # Router, App entry, Providers
│   │   ├── components/   # UI primitives, Chat, Citations, Documents, Layout
│   │   ├── context/      # AuthContext, NotificationContext
│   │   ├── layouts/      # PublicLayout, DashboardLayout, AdminLayout
│   │   ├── mocks/        # Isolated mock data & services for development
│   │   ├── pages/        # Landing, Login, Register, Dashboards, Chat, History, Admin
│   │   ├── services/     # Centralized apiClient and typed service layers
│   │   ├── types/        # Strongly typed TypeScript models
│   │   └── utils/        # Formatters, styling utilities
│   ├── tests/            # Vitest + React Testing Library test suites
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── README.md
├── package.json          # Root convenience scripts
└── README.md             # Repository documentation
```

---

## Quick Start

### 1. Run Development Server
```bash
npm run dev
```
Access the application in your browser at:
`http://localhost:5173/`

### 2. Run Test Suite
```bash
npm run test
```
Executes all unit and integration test suites.

### 3. Build for Production
```bash
npm run build
```
Compiles and generates the production-optimized bundle.

---

## Demo Credentials (Mock Mode)
- **Student Account:** `student@university.edu` / `Password123!`
- **Faculty Account:** `faculty@university.edu` / `Password123!`
- **Administrator Account:** `admin@university.edu` / `Password123!`

For detailed documentation, refer to [frontend/README.md](file:///c:/CampusMind/frontend/README.md).
