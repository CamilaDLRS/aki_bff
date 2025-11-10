import { Request, Response } from 'express';
import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { TeacherLoginUseCase } from './useCase';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const teacherLoginUseCase = new TeacherLoginUseCase(personasGateway);

export async function teacherLoginController(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ code: 'missing_fields', message: 'Email and password are required.' });
  }
  try {
    const result = await teacherLoginUseCase.execute(email, password);
    if (result.code === 'invalid_credentials') {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (err: any) {
    if (err.status && err.data) {
      return res.status(err.status).json(err.data);
    }
    res.status(500).json({ code: 'internal_error', message: err.message });
  }
}
