import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { AttendanceRecordDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

export class CorrectAttendanceUseCase {
  private coreGateway: CoreGateway;
  constructor(coreGateway: CoreGateway) {
    this.coreGateway = coreGateway;
  }

  async execute(eventId: string, payload: any): Promise<AttendanceRecordDTO> {
    try {
      const res = await this.coreGateway.registerAttendance({ event_id: eventId, ...payload });
      return res.data;
    } catch (error: any) {
      logger.error(`Failed to register/correct attendance: ${error.message}`);
      throw { status: 500, message: 'Failed to register/correct attendance' };
    }
  }
}
