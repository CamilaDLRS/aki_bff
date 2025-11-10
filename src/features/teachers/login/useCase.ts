import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { logger } from '../../../shared/logger';

export class TeacherLoginUseCase {
  private personasGateway: PersonasGateway;
  
  constructor(personasGateway: PersonasGateway) {
    this.personasGateway = personasGateway;
  }

  async execute(email: string, password: string): Promise<any> {
    try {
      const response = await this.personasGateway.teacherLogin(email, password);
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to login teacher: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          data: error.response.data
        };
      }
      throw { status: 500, message: 'Failed to login' };
    }
  }
}
