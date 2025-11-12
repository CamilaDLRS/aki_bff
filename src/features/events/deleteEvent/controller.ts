import { Request, Response } from 'express';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { DeleteEventUseCase } from './useCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const deleteEventUseCase = new DeleteEventUseCase(coreGateway);

export async function deleteEventController(req: Request, res: Response) {
  const eventId = req.params.eventId;
  try {
    await deleteEventUseCase.execute(eventId);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'delete_event_error', message: err.message });
  }
}
