import { Request, Response } from 'express';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { ListClassEventsUseCase } from './useCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const listClassEventsUseCase = new ListClassEventsUseCase(coreGateway);

export async function listClassEventsController(req: Request, res: Response) {
  const classId = Number(req.params.classId);
  if (!classId) {
    return res.status(400).json({ code: 'missing_class_id', message: 'classId is required' });
  }
  try {
    const events = await listClassEventsUseCase.execute(classId);
    res.json(events);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
