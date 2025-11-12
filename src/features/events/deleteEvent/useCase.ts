import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { logger } from '../../../shared/logger';

export class DeleteEventUseCase {
  private coreGateway: CoreGateway;
  constructor(coreGateway: CoreGateway) {
    this.coreGateway = coreGateway;
  }

  async execute(eventId: string): Promise<void> {
    if (!eventId) {
      throw { status: 400, message: 'eventId is required' };
    }
    try {
      await this.coreGateway.deleteEvent(eventId);
    } catch (error: any) {
      logger.error(`Failed to delete event ${eventId}: ${error.message}`);
      if (error.response) {
        throw { status: error.response.status, message: error.response.data?.message || error.message };
      }
      throw { status: error.status || 500, message: error.message || 'Failed to delete event' };
    }
  }
}
