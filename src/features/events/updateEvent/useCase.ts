import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { EventDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

interface UpdateEventInput {
  eventId: string;
  startAt?: string; // ISO
  endAt?: string;   // ISO
  status?: 'active' | 'closed' | 'canceled';
}

export class UpdateEventUseCase {
  private coreGateway: CoreGateway;
  constructor(coreGateway: CoreGateway) {
    this.coreGateway = coreGateway;
  }

  async execute(input: UpdateEventInput): Promise<EventDTO> {
    if (!input.eventId) {
      throw { status: 400, message: 'eventId is required' };
    }
    if (!input.startAt && !input.endAt && !input.status) {
      throw { status: 400, message: 'No fields provided to update' };
    }
    // Basic ISO format check to catch missing 'T' (common typo) before hitting Core
    const isIso = (d?: string) => !d || /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(d);
    if (!isIso(input.startAt)) {
      throw { status: 400, message: 'startAt must be ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ)' };
    }
    if (!isIso(input.endAt)) {
      throw { status: 400, message: 'endAt must be ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ)' };
    }
    try {
      const payload: any = {};
      if (input.startAt) payload.start_time = input.startAt;
      if (input.endAt) payload.end_time = input.endAt;
      if (input.status) payload.status = input.status;

      const res = await this.coreGateway.updateEvent(input.eventId, payload);
      const e = res.data?.data || res.data;
      if (!e) {
        throw { status: res.status || 500, message: 'Empty response from core' };
      }
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
      logger.error(`Failed to update event ${input.eventId}: ${error.message}`);
      if (error.response) {
        // Surface more detail if available
        throw {
          status: error.response.status,
            message: error.response.data?.message || error.message,
            details: error.response.data?.details || error.response.data || undefined
        };
      }
      throw { status: error.status || 500, message: error.message || 'Failed to update event' };
    }
  }
}
