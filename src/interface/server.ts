import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

import swaggerRouter from './swagger';
app.use(swaggerRouter);

// Import controllers from features
import { listTeacherClassesController, getClassDetailsController } from '../features/classes';
import { listClassEventsController, getEventDetailsController, createEventController } from '../features/events';
import { registerAttendanceController } from '../features/attendance';
import { deleteStudentDeviceController } from '../features/students';
import { teacherLoginController, recoverPasswordController } from '../features/teachers';

// 1. List teacher's classes
app.get('/teachers/:teacherEmail/classes', listTeacherClassesController);

// 2. Retrieve class details with recent events
app.get('/classes/:classId', getClassDetailsController);

// 3. List events of a class
app.get('/classes/:classId/events', listClassEventsController);

// 4. Get event details with attendance list
app.get('/events/:eventId', getEventDetailsController);

// 4b. Create event
app.post('/events', createEventController);

// 5. Register attendance (no eventId in URL)
app.post('/events/attendance', registerAttendanceController);

// 6. Delete a student's device association
app.delete('/students/:studentId/device', deleteStudentDeviceController);

// 7. Teacher login
app.post('/auth/login', teacherLoginController);

// 8. Teacher password recovery
app.post('/auth/recover-password', recoverPasswordController);


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
