import { CoreGateway } from '../../infrastructure/gateways/CoreGateway';
import { EventDTO } from '../../shared/dto';
import { logger } from '../../infrastructure/logger';

export class ListClassEventsUseCase {
  private coreGateway: CoreGateway;
  constructor(coreGateway: CoreGateway) {
    this.coreGateway = coreGateway;
  }

  async execute(classId: number): Promise<EventDTO[]> {
    try {
      const eventsRes = await this.coreGateway.getClassEvents(classId);
      const events = eventsRes.data.data || [];
      // Map to BFF contract (camelCase fields)
      return events.map((e: any) => ({
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
      }));
    } catch (error: any) {
      logger.error(`Failed to list events for class ${classId}: ${error.message}`);
      throw { status: 500, message: 'Failed to fetch class events' };
    }
  }
}
