# AKI! BFF (Backend-for-Frontend)

## 🏗️ Architecture: Vertical Slice

This service aggregates data from the Personas and Core microservices following **Vertical Slice Architecture**. Each feature is organized independently with its own use case and controller.

### 📚 Documentation
- 📖 **[Vertical Slice Architecture](./VERTICAL_SLICE_ARCHITECTURE.md)** - Architecture overview
- 🔄 **[Migration Guide](./MIGRATION_GUIDE.md)** - What changed in the migration
- ✅ **[Migration Complete](./MIGRATION_COMPLETE.md)** - Summary of completed work
- 📊 **[Architecture Diagram](./ARCHITECTURE_DIAGRAM.md)** - Visual diagrams
- 💡 **[Practical Examples](./PRACTICAL_EXAMPLES.md)** - How to add features

## 🚀 Quick Start

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

## 📁 Project Structure

```
src/
├── features/              # Features organized by domain
│   ├── attendance/        # Attendance management
│   ├── events/           # Event management
│   ├── classes/          # Class management
│   ├── students/         # Student management
│   └── teachers/         # Teacher management
│
├── shared/               # Shared code
│   ├── domain/          # DTOs and domain entities
│   ├── infrastructure/  # Gateways, middleware
│   └── logger/          # Logging utility
│
└── interface/           # HTTP layer
    ├── server.ts       # Express server
    └── swagger.ts      # API documentation
```

## 🎯 Features

### Attendance
- `POST /events/attendance` - Register student attendance

### Events
- `POST /events` - Create new event
- `GET /events/:eventId` - Get event details with attendance
- `GET /classes/:classId/events` - List class events

### Classes
- `GET /classes/:classId` - Get class details
- `GET /teachers/:teacherEmail/classes` - List teacher's classes

### Students
- `DELETE /students/:studentId/device` - Remove device association

### Teachers
- `POST /auth/login` - Teacher login
- `POST /auth/recover-password` - Password recovery

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

## 🐳 Docker
Build and run with Docker Compose:
```bash
docker-compose up --build
```

## 📝 API Documentation

See the BFF OpenAPI spec in `bff.yaml` or access Swagger UI at `/api-docs` when the server is running.

## 🔧 Adding a New Feature

1. Create feature directory: `src/features/{domain}/{featureName}/`
2. Create `useCase.ts` with business logic
3. Create `controller.ts` with HTTP handling
4. Export in `src/features/{domain}/index.ts`
5. Register route in `src/interface/server.ts`

See **[Practical Examples](./PRACTICAL_EXAMPLES.md)** for detailed guides.

## 🏛️ Architecture Principles

- **Vertical Slice**: Features organized by business capability
- **Single Responsibility**: Each file has one clear purpose
- **Low Coupling**: Features are independent
- **High Cohesion**: Related code stays together

## 🤝 Contributing

When adding new features:
- Follow the existing structure
- Keep business logic in use cases
- Keep HTTP concerns in controllers
- Share common code in `shared/`

---

**Version**: 2.0.0 (Vertical Slice Architecture)  
**Last Updated**: November 10, 2025

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
