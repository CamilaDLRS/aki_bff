import { Request, Response } from 'express';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { UpdateEventUseCase } from './useCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const updateEventUseCase = new UpdateEventUseCase(coreGateway);

export async function updateEventController(req: Request, res: Response) {
  const eventId = req.params.eventId;
  const { startAt, endAt, status } = req.body;
  try {
    const event = await updateEventUseCase.execute({ eventId, startAt, endAt, status });
    res.json(event);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'update_event_error', message: err.message });
  }
}
