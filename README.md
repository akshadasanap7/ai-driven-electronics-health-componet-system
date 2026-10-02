# AI-Driven Electronic Component Intelligence and Diagnostic Platform

> Intelligent electronic component testing platform — measures electrical parameters via STM32 hardware (or simulation), processes measurements through a FastAPI backend, performs AI-powered health/fault diagnosis, and displays everything on a modern animated React dashboard.

---

## Live Architecture

```
React Dashboard  →  FastAPI Backend  →  SQLite / PostgreSQL
                          ↓
                   Hardware Service
                    ↙           ↘
          SimulatorHardware   STM32Hardware (UART)
                                    ↓
                            Measurement Circuits
                                    ↓
                          Component Under Test
                          ↓
                   AI Diagnosis Engine
                    ↙           ↘
           Rule-Based          ML Model (ready)
                ↓
         Health Score + Fault Detection + Recommendation
                ↓
         React Dashboard → Live Charts → Report
```

---

## Features

| Feature | Status |
|---------|--------|
| Component selection (Resistor, Capacitor, Diode, Transistor, IC) | ✅ |
| Test configuration with expected value + tolerance | ✅ |
| Real-time measurement polling with animated charts | ✅ |
| AI health score (0–100) with animated circular gauge | ✅ |
| Rule-based fault detection + recommendations | ✅ |
| ML model architecture (RandomForest, ready to train) | ✅ |
| Full test history with search + filter | ✅ |
| Detailed printable test reports | ✅ |
| Simulation mode (no hardware needed) | ✅ |
| STM32 hardware mode (UART/USB) | ✅ |
| Dark glassmorphism UI with Framer Motion animations | ✅ |
| Responsive layout | ✅ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, Framer Motion, Recharts, Lucide React |
| Backend | Python, FastAPI, SQLAlchemy 2, Pydantic v2, Uvicorn |
| Database | SQLite (dev) — PostgreSQL-ready |
| AI/ML | NumPy, Pandas, Scikit-learn, Rule-based engine |
| Hardware | STM32, UART/USB serial, ADC, GPIO |

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/akshadasanap7/ai-driven-electronics-health-componet-system.git
cd ai-driven-electronics-health-componet-system
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies (use pre-built wheels — no compiler needed)
python -m pip install --only-binary=:all: fastapi uvicorn[standard] sqlalchemy pydantic pydantic-settings python-dotenv pyserial aiofiles python-multipart numpy pandas scikit-learn

# Copy env file
copy .env.example .env

# Start server
python -m uvicorn app.main:app --reload --port 8000
```

API available at: **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

### 3. Frontend

```bash
cd frontend

# Install packages
npm install

# Copy env file
copy .env.example .env

# Start dev server
npm run dev
```

Dashboard available at: **http://localhost:5173**

### 4. One-click start (Windows)

Double-click **`start_all.bat`** — opens backend and frontend in separate terminal windows.

---

## Project Structure

```
component-intelligence/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Settings from .env
│   │   ├── api/                 # Route handlers (tests, measurements, diagnosis, reports, system, history)
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer
│   │   ├── ai/                  # Diagnosis engine + ML model architecture
│   │   ├── hardware/            # STM32 + Simulator abstraction layer
│   │   └── database/            # DB setup + seed data
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/          # 12 reusable UI components
│   │   ├── pages/               # 8 route pages
│   │   ├── services/api.js      # Axios API client
│   │   ├── hooks/useTestData.js # Live measurement polling hook
│   │   └── utils/formatters.js  # Value formatters
│   └── .env.example
│
├── start_all.bat                # One-click launcher (Windows)
├── start_backend.bat
└── start_frontend.bat
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/status` | Hardware + system health |
| GET | `/api/components` | Supported component list |
| POST | `/api/tests` | Create a new test |
| GET | `/api/tests` | List all tests |
| GET | `/api/tests/{id}` | Get test by ID |
| POST | `/api/tests/{id}/start` | Start a test |
| POST | `/api/tests/{id}/measure` | Acquire one measurement |
| GET | `/api/tests/{id}/measurements` | All measurements for test |
| POST | `/api/tests/{id}/diagnose` | Run AI diagnosis |
| GET | `/api/tests/{id}/diagnosis` | Get diagnosis result |
| GET | `/api/tests/{id}/report` | Full test report |
| GET | `/api/history` | Test history with diagnosis |

---

## Simulation Mode

Set `HARDWARE_MODE=simulation` in `backend/.env` (default).

The `SimulatorHardware` generates:
- Gaussian noise around nominal component values
- Sinusoidal drift for realistic animated charts
- ~20% chance of fault injection per test session
- Gradual fault drift over time (not instant jumps)

---

## STM32 Hardware Mode

Set `HARDWARE_MODE=hardware` and `SERIAL_PORT=COM3` in `backend/.env`.

Flash your STM32 to send JSON over UART at 115200 baud:
```json
{"voltage": 3.301, "current": 0.0331, "resistance": 99.7, "capacitance": null, "temperature": 25.3}
```

---

## AI Diagnosis Engine

**Rule-based (active):**
```
deviation% = |measured - expected| / expected × 100
health_score = 100 - min(deviation% × 2, 80)

≥ 90  → HEALTHY  (green)
70–89 → WARNING  (yellow)
< 70  → FAULT    (red)
```

**ML model (architecture ready):**
`backend/app/ai/model.py` — RandomForestClassifier with `train()`, `predict()`, `save_model()`, `load_model()`. Train with real labeled hardware data when available.

---

## Safety

- Max voltage: 30 V
- Max current: 2 A
- Temperature warning: > 85 °C
- Unsafe configurations rejected before test starts
- Designed for **low-voltage bench testing only**

---

## Screenshots

> Dashboard → New Test → Live Test → AI Diagnosis → Report

---

## License

MIT
