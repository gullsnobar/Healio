# HEALIO - All-in-One Health Management App

<p align="center">
  <strong>Medication Reminder & Fitness Tracker</strong><br/>
  Final Year Project | Department of Information Sciences | University of Education, Lahore
</p>

---

## Overview

HEALIO is a comprehensive mobile health management application that combines **medication management**, **appointment scheduling**, **fitness tracking**, and **AI-powered health insights** into one seamless platform. It solves a real-world problem: people with busy schedules forget medications, miss doctor appointments, and struggle to track their fitness consistently.

## Key Features

- **Medication Management** — Add, edit, track medications with smart reminders
- **Appointment Scheduling** — Doctor visits and lab report pickups with 24h/1h advance alerts
- **Lab Report Storage** — Upload and store blood tests, X-rays securely
- **Fitness Tracking** — Auto-sync with Google Fit API; manual logging for water, diet, sleep
- **AI Health Chatbot** — Natural language health queries powered by Google Gemini API
- **Personalized Recommendations** — Weekly AI-generated tips based on your actual data
- **Missed Dose Detection** — AI scans medication logs and alerts trusted contacts
- **Trusted Contacts** — Caregivers get visibility into patient medication adherence
- **Offline Mode** — Cached reminders viewable offline; synced on reconnect
- **Multi-language** — English and Urdu support (WCAG 2.1 AA compliant)

## Technology Stack

| Layer              | Technology                | Purpose                                |
|--------------------|---------------------------|----------------------------------------|
| Mobile App         | React Native + Expo       | Cross-platform Android & iOS           |
| Backend API        | Node.js + Express.js      | REST API with MVC pattern              |
| Database           | MongoDB Atlas             | Cloud NoSQL database                   |
| Push Notifications | Firebase Cloud Messaging  | Medication reminders & alerts          |
| Fitness Data       | Google Fit API            | Auto-sync steps, sleep, calories       |
| Authentication     | JWT + bcryptjs            | Secure login (30-min token expiry)     |
| AI Chatbot         | Google Gemini API         | Natural language health queries        |
| AI Engine          | Python (FastAPI)          | ML models, pattern detection           |
| State Management   | Redux Toolkit             | Global app state                       |
| Scheduled Jobs     | node-cron                 | Background reminder checks every minute|

## Project Structure

```
healio/
├── frontend/          # React Native mobile app (Expo)
├── backend/           # Node.js + Express REST API
├── ai-engine/         # Python AI/ML services (FastAPI)
├── docs/              # Project documentation
├── .gitignore
├── README.md
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas account
- Firebase project (for FCM)
- Google Cloud project (for Fit API & Gemini)
- Expo CLI (`npm install -g expo-cli`)

### Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/yourusername/healio.git
cd healio

# 2. Backend
cd backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npx expo start

# 4. AI Engine (new terminal)
cd ai-engine
pip install -r requirements.txt
python src/api/app.py
```

## API Endpoints

### Authentication
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | `/api/auth/register`   | Register new user    |
| POST   | `/api/auth/login`      | Login & get JWT      |
| POST   | `/api/auth/logout`     | Invalidate session   |
| POST   | `/api/auth/forgot-password` | Password reset  |
| POST   | `/api/auth/verify-otp` | OTP verification     |

### Medications
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | `/api/medications`            | List all medications   |
| POST   | `/api/medications`            | Add medication         |
| PUT    | `/api/medications/:id`        | Update medication      |
| DELETE | `/api/medications/:id`        | Delete medication      |
| POST   | `/api/medications/:id/take`   | Mark as taken          |

### Appointments
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | `/api/appointments`           | List appointments      |
| POST   | `/api/appointments`           | Create appointment     |
| PUT    | `/api/appointments/:id`       | Update appointment     |
| DELETE | `/api/appointments/:id`       | Delete appointment     |

### Fitness
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | `/api/fitness/daily`          | Daily fitness data     |
| GET    | `/api/fitness/weekly`         | Weekly summary         |
| POST   | `/api/fitness/sync`           | Sync Google Fit        |
| POST   | `/api/fitness/manual`         | Manual entry           |

### AI Services
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| POST   | `/api/chatbot`                | Chat with AI           |
| GET    | `/api/recommendations`        | Get AI recommendations |
| GET    | `/api/chatbot/history`        | Chat history           |

## Security

- JWT tokens expire after 30 minutes
- Passwords hashed with bcrypt (10 salt rounds)
- AES-256 encryption for sensitive data
- HTTPS/TLS for all API communication
- Rate limiting (100 requests per 15-min window)
- Role-based access control (RBAC)
- CORS protection enabled

## License

Developed for educational purposes at the University of Education, Lahore.

---

**HEALIO FYP | Department of Information Sciences | University of Education, Lahore | May 2026**
