import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { StudentDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

export class ManageStudentDeviceUseCase {
  private personasGateway: PersonasGateway;
  constructor(personasGateway: PersonasGateway) {
    this.personasGateway = personasGateway;
  }
  
  async delete(studentId: number): Promise<StudentDTO> {
    try {
      // PATCH /students/{id} with deviceId = null
      const res = await this.personasGateway.updateStudentDevice(studentId, null);
      return res.data;
    } catch (error: any) {
      logger.error(`Failed to delete device: ${error.message}`);
      throw { status: 500, message: 'Failed to delete device' };
    }
  }
}
