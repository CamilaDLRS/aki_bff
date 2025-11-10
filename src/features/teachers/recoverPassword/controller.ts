import { Request, Response } from 'express';
import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { RecoverPasswordUseCase } from './useCase';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const recoverPasswordUseCase = new RecoverPasswordUseCase(personasGateway);

export async function recoverPasswordController(req: Request, res: Response) {
  const { teacher_email } = req.body;
  if (!teacher_email) {
    return res.status(400).json({ code: 'missing_fields', message: 'teacher_email is required.' });
  }
  try {
    const result = await recoverPasswordUseCase.execute(teacher_email);
    // If error object present, return 404
    if (result && result.error && result.error.code === 'not_found') {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err: any) {
    if (err.status && err.data) {
      return res.status(err.status).json(err.data);
    }
    res.status(500).json({ code: 'internal_error', message: err.message });
  }
}
