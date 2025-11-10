import { Request, Response } from 'express';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { RegisterAttendanceUseCase } from './useCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const registerAttendanceUseCase = new RegisterAttendanceUseCase(personasGateway, coreGateway);

export async function registerAttendanceController(req: Request, res: Response) {
  // Accepts: device_id, qr_token, location, device_time, student_cpf (optional)
  const { device_id, qr_token, location, device_time, student_cpf } = req.body;
  if (!device_id || !qr_token) {
    return res.status(400).json({ code: 'missing_fields', message: 'device_id and qr_token are required.' });
  }
  try {
    const result = await registerAttendanceUseCase.execute({ device_id, qr_token, location, device_time, student_cpf });
    if ('code' in result) {
      // ErrorResponse
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
