import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { EventDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

interface CreateEventInput {
  classId: number;
  teacherId: number;
  startAt: string; // ISO
  endAt: string;   // ISO
  location: { latitude: number; longitude: number };
}

export class CreateEventUseCase {
  private coreGateway: CoreGateway;
  constructor(coreGateway: CoreGateway) {
    this.coreGateway = coreGateway;
  }

  async execute(input: CreateEventInput): Promise<EventDTO> {
    // Basic validation (could be expanded)
    if (!input.classId || !input.teacherId || !input.startAt || !input.endAt || !input.location) {
      throw { status: 400, message: 'Missing required fields' };
    }
    try {
      const payload = {
        class_id: input.classId,
        teacher_id: input.teacherId,
        start_time: input.startAt,
        end_time: input.endAt,
        location: input.location,
      };

      const res = await this.coreGateway.createEvent(payload);
      const e = res.data?.data || res.data; // depending on core response envelope
      const event: EventDTO = {
        id: e.id,
        classId: e.class_id,
        teacherId: e.teacher_id,
        startAt: e.start_time,
        endAt: e.end_time,
        status: e.status,
        location: e.location,
        qrToken: e.qr_token,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      };
      return event;
    } catch (error: any) {
      // Log full error details for investigation
      logger.error(`Failed to create event: ${error.message}`);
      if (error.response) {
        logger.error(`Core response status: ${error.response.status}`);
        logger.error(`Core response data: ${JSON.stringify(error.response.data)}`);
        throw {
          status: error.response.status,
          message: error.response.data?.message || error.message,
          details: error.response.data
        };
      }
      throw { status: 500, message: 'Failed to create event', details: error.message };
    }
  }
}
