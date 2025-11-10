import { Request, Response } from 'express';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { CreateEventUseCase } from './useCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const createEventUseCase = new CreateEventUseCase(coreGateway);

export async function createEventController(req: Request, res: Response) {
  const { classId, teacherId, startAt, endAt, location } = req.body;
  try {
    const event = await createEventUseCase.execute({
      classId,
      teacherId,
      startAt,
      endAt,
      location,
    });
    res.status(201).json(event);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'create_event_error', message: err.message });
  }
}
