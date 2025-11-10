import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { logger } from '../../../shared/logger';

export class RecoverPasswordUseCase {
  private personasGateway: PersonasGateway;
  
  constructor(personasGateway: PersonasGateway) {
    this.personasGateway = personasGateway;
  }

  async execute(teacher_email: string): Promise<any> {
    try {
      const response = await this.personasGateway.teacherRecoverPassword(teacher_email);
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to recover password: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          data: error.response.data
        };
      }
      throw { status: 500, message: 'Failed to recover password' };
    }
  }
}
