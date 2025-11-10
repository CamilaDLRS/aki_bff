import { Request, Response } from 'express';
import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { GetClassDetailsUseCase } from './useCase';

const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const getClassDetailsUseCase = new GetClassDetailsUseCase(personasGateway, coreGateway);

export async function getClassDetailsController(req: Request, res: Response) {
  const classId = Number(req.params.classId);
  if (!classId) {
    return res.status(400).json({ code: 'missing_class_id', message: 'classId is required' });
  }
  try {
    const result = await getClassDetailsUseCase.execute(classId);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
