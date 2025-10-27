import { Request, Response } from 'express';
import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { ManageStudentDeviceUseCase } from '../../app/usecases/ManageStudentDeviceUseCase';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const manageStudentDeviceUseCase = new ManageStudentDeviceUseCase(personasGateway);

export async function deleteStudentDevice(req: Request, res: Response) {
  const studentId = Number(req.params.studentId);
  if (!studentId) {
    return res.status(400).json({ code: 'missing_student_id', message: 'studentId is required' });
  }
  try {
    const student = await manageStudentDeviceUseCase.delete(studentId);
    res.json(student);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
