import { Request, Response } from 'express';
import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { ListTeacherClassesUseCase } from '../../app/usecases/ListTeacherClassesUseCase';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const listTeacherClassesUseCase = new ListTeacherClassesUseCase(personasGateway);

export async function listTeacherClasses(req: Request, res: Response) {
  const teacherEmail = req.headers['x-teacher-email'] as string || req.params.teacherEmail;
  if (!teacherEmail) {
    return res.status(400).json({ code: 'missing_teacher_email', message: 'X-Teacher-Email header is required' });
  }
  try {
    const classes = await listTeacherClassesUseCase.execute(teacherEmail);
    res.json(classes);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err });
  }
}
