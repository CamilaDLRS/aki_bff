import { Request, Response } from 'express';
import { CoreGateway } from '../../infrastructure/gateways/CoreGateway';
import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { RegisterAttendanceBffUseCase } from '../../app/usecases/RegisterAttendanceBffUseCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const registerAttendanceBffUseCase = new RegisterAttendanceBffUseCase(personasGateway, coreGateway);

export async function registerAttendance(req: Request, res: Response) {
  // Accepts: device_id, qr_token, location, device_time, student_cpf (optional)
  const { device_id, qr_token, location, device_time, student_cpf } = req.body;
  if (!device_id || !qr_token) {
    return res.status(400).json({ code: 'missing_fields', message: 'device_id and qr_token are required.' });
  }
  try {
    const result = await registerAttendanceBffUseCase.execute({ device_id, qr_token, location, device_time, student_cpf });
    if ('code' in result) {
      // ErrorResponse
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
