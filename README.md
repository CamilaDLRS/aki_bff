# AKI! BFF (Backend-for-Frontend)

## Overview
This service aggregates data from the Personas and Core microservices to deliver complete, render-ready responses for the AKI! frontend. It follows Clean Architecture, SOLID, and Vertical Slice principles.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env`:
   ```env
   PERSONAS_URL=http://localhost:3002
   CORE_URL=http://localhost:3001
   PORT=3000
   ```
3. Start the server:
   ```bash
   npm run build && npm start
   ```

## Architecture
- **src/app/**: UseCases (business logic per endpoint)
- **src/domain/**: Domain models & interfaces
- **src/infrastructure/**: Gateways (HTTP clients), logging
- **src/interface/**: Controllers (Express routes)
- **src/shared/**: DTOs, error types

## Endpoint Mapping
| BFF Endpoint | Personas/Core Calls |
|--------------|--------------------|
| GET /teachers/{teacherEmail}/classes | Personas: `/teachers/{email}/classes` |
| GET /classes/{classId} | Personas: `/classes/{classId}`<br>Core: `/events?class_id={classId}&size=5` |
| GET /classes/{classId}/events | Core: `/events?class_id={classId}` |
| GET /events/{eventId} | Core: `/events/{eventId}`<br>Core: `/attendances?event_id={eventId}`<br>Personas: `/classes/{classId}/students` |
| POST /events/{eventId}/attendance | Core: `POST /attendances` |
| POST/DELETE /students/{studentId}/device | Personas: `PATCH /students/{id}` |
| POST /events | Core: `POST /events` |

## Example Request/Response

### List Teacher's Classes
**Request:**
```
GET /teachers/jane.doe@aki.example/classes
X-Teacher-Email: jane.doe@aki.example
```
**Response:**
```
[
  {
    "id": 1,
    "code": "MATH101",
    "name": "Mathematics 101",
    "teachers": [...],
    "students": [...]
  },
  ...
]
```

## Testing
Run unit tests:
```bash
npm test
```

## Docker
Build and run with Docker Compose:
```bash
docker-compose up --build
```

---
For details on endpoint orchestration, see the BFF OpenAPI spec in `bff.yaml`.

### Create Event
Request:
```
POST /events
Content-Type: application/json

{
   "classId": 42,
   "teacherId": 9,
   "startAt": "2025-11-08T13:00:00Z",
   "endAt": "2025-11-08T14:00:00Z",
   "location": { "latitude": -23.55052, "longitude": -46.633308 }
}
```
Response (201):
```
{
   "id": "6741e1e93f8c2c5e8c1d0abc",
   "classId": 42,
   "teacherId": 9,
   "startAt": "2025-11-08T13:00:00Z",
   "endAt": "2025-11-08T14:00:00Z",
   "status": "active",
   "location": { "latitude": -23.55052, "longitude": -46.633308 },
   "qrToken": "eyJhbGciOi...",
   "createdAt": "2025-11-08T12:55:00Z",
   "updatedAt": "2025-11-08T12:55:00Z"
}
```
