import { Request, Response } from 'express';
import { CoreGateway } from '../../infrastructure/gateways/CoreGateway';
import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { GetEventDetailsUseCase } from '../../app/usecases/GetEventDetailsUseCase';

const coreGateway = new CoreGateway(process.env.CORE_URL || 'http://localhost:3001');
const personasGateway = new PersonasGateway(process.env.PERSONAS_URL || 'http://localhost:3002');
const getEventDetailsUseCase = new GetEventDetailsUseCase(coreGateway, personasGateway);

export async function getEventDetails(req: Request, res: Response) {
  const eventId = req.params.eventId;
  if (!eventId) {
    return res.status(400).json({ code: 'missing_params', message: 'eventId is required' });
  }
  try {
    const result = await getEventDetailsUseCase.execute(eventId);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ code: 'internal_error', message: err.message });
  }
}
