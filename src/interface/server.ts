import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

import swaggerRouter from './swagger';
app.use(swaggerRouter);


import { listTeacherClasses } from './controllers/classesController';
import { getClassDetails } from './controllers/classDetailsController';
import { listClassEvents } from './controllers/classEventsController';
import { getEventDetails } from './controllers/eventDetailsController';
import { registerAttendance } from './controllers/attendanceController';
import { deleteStudentDevice } from './controllers/studentDeviceController';
import { teacherLogin, teacherRecoverPassword } from './controllers/authController';
import { createEvent } from './controllers/createEventController';

// 1. List teacher’s classes
app.get('/teachers/:teacherEmail/classes', listTeacherClasses);

// 2. Retrieve class details with recent events
app.get('/classes/:classId', getClassDetails);

// 3. List events of a class
app.get('/classes/:classId/events', listClassEvents);

// 4. Get event details with attendance list
app.get('/events/:eventId', getEventDetails);

// 4b. Create event
app.post('/events', createEvent);

// 5. Register attendance (no eventId in URL)
app.post('/events/attendance', registerAttendance);

// 6. Delete a student’s device association
app.delete('/students/:studentId/device', deleteStudentDevice);

// 7. Teacher login
app.post('/auth/login', teacherLogin);

// 8. Teacher password recovery
app.post('/auth/recover-password', teacherRecoverPassword);


import { Request, Response, NextFunction } from 'express';
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
});

const PORT = process.env.PORT || 3000;
console.info(`Using Personas URL: ${process.env.PERSONAS_URL}`);
console.info(`Using Core URL: ${process.env.CORE_URL}`);
app.listen(PORT, () => {
  console.info(`AKI! BFF running on port ${PORT}`);
});
