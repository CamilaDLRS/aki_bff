import { Request, Response } from 'express';
import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');

export async function teacherLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ code: 'missing_fields', message: 'Email and password are required.' });
  }
  try {
    const response = await personasGateway.teacherLogin(email, password);
    if (response.data.code === 'invalid_credentials') {
      return res.status(401).json(response.data);
    }
    res.json(response.data);
  } catch (err: any) {
    if (err.response) {
      // Forward actual status and error from Personas service
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({ code: 'internal_error', message: err.message });
  }
}

export async function teacherRecoverPassword(req: Request, res: Response) {
  const { teacher_email } = req.body;
  if (!teacher_email) {
    return res.status(400).json({ code: 'missing_fields', message: 'teacher_email is required.' });
  }
  try {
    const response = await personasGateway.teacherRecoverPassword(teacher_email);
    // If error object present, return 404
    if (response.data && response.data.error && response.data.error.code === 'not_found') {
      return res.status(404).json(response.data);
    }
    res.json(response.data);
  } catch (err: any) {
    if (err.response) {
      // Forward actual status and error from Personas service
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({ code: 'internal_error', message: err.message });
  }
}
