# HEALIO API Documentation

## Base URL
- Development: http://localhost:5000/api
- Production: https://api.healio.com/api

## Authentication
All protected endpoints require Bearer token:
`Authorization: Bearer <access_token>`

## Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login |
| POST | /auth/logout | Logout |
| POST | /auth/refresh-token | Refresh JWT |
| POST | /auth/forgot-password | Send OTP |
| POST | /auth/verify-otp | Verify OTP |
| POST | /auth/reset-password | Reset password |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /medications | List all medications |
| POST | /medications | Create medication |
| GET | /medications/:id | Get single medication |
| PUT | /medications/:id | Update medication |
| DELETE | /medications/:id | Delete medication |
| POST | /medications/:id/adherence | Record dose |
| GET | /medications/stats/adherence | Get adherence stats |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /appointments | List appointments |
| POST | /appointments | Create appointment |
| GET | /appointments/upcoming | Upcoming appointments |

### Fitness
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /fitness | Get fitness data |
| POST | /fitness/sync | Sync Google Fit |
| POST | /fitness/manual | Add manual entry |
| GET/POST | /fitness/water | Water intake |
| GET/POST | /fitness/diet | Diet logging |

### AI Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /chatbot/message | Send chat message |
| GET | /recommendations | Get AI recommendations |
| POST | /lab-reports/:id/analyze | Analyze lab report |

## Error Response Format
`json
{
  \"success\": false,
  \"message\": \"Error description\",
  \"errors\": [{ \"field\": \"email\", \"message\": \"Valid email required\" }]
}
`
"@

New-File "c:\Users\User\healio\docs\deployment\deploymentGuide.md" @"
# Deployment Guide

## Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Firebase project
- Google Cloud project (Fit API + Gemini)
- Docker & Docker Compose

## Environment Setup
1. Clone repository
2. Copy .env.example to .env in backend/ and ai-engine/
3. Fill in all environment variables

## Development
`bash
# Backend
cd backend && npm install && npm run dev

# AI Engine
cd ai-engine && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend
cd frontend && npm install && npx expo start
`

## Docker Deployment
`bash
docker-compose up -d
`

## Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Enable Firebase security rules
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
- [ ] Enable database backups
- [ ] Review CORS allowed origins
