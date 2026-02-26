# System Architecture

## High-Level Architecture
`
Mobile App (React Native) --> Backend API (Express.js) --> MongoDB Atlas
                                    |
                              AI Engine (FastAPI) --> Google Gemini API
                                    |
                          Firebase Cloud Messaging
                          Google Fit API
`

## Component Architecture
- **Presentation Layer:** React Native screens + components
- **State Layer:** Redux Toolkit store with slices
- **Service Layer:** API services + Firebase + Google Fit
- **Backend API Layer:** Express routes + controllers
- **Business Logic Layer:** Services + Jobs
- **Data Layer:** MongoDB models via Mongoose
- **AI Layer:** FastAPI endpoints + ML models

## Data Flow
1. User interacts with mobile UI
2. Redux dispatches actions with API calls
3. Express backend processes requests
4. MongoDB stores/retrieves data
5. AI engine processes ML/AI requests
6. Push notifications via Firebase
