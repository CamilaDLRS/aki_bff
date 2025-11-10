import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { ClassDTO, EventDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

export class GetClassDetailsUseCase {
  private personasGateway: PersonasGateway;
  private coreGateway: CoreGateway;
  constructor(personasGateway: PersonasGateway, coreGateway: CoreGateway) {
    this.personasGateway = personasGateway;
    this.coreGateway = coreGateway;
  }

  async execute(classId: number): Promise<{ class: ClassDTO; recentEvents: EventDTO[] }> {
    try {
      const classRes = await this.personasGateway.getClass(classId);
      const classData = classRes.data.data;
      const eventsRes = await this.coreGateway.getClassEvents(classId, 50);
      console.log(eventsRes.data);

      return {
        class: {
          id: classData.id,
          code: classData.code,
          name: classData.name,
          teachers: (classData.teachers || []).map((t: any) => ({
            id: t.id,
            fullName: t.full_name,
            email: t.email,
          })),
          students: (classData.students || []).map((s: any) => ({
            id: s.id,
            fullName: s.full_name,
            cpf: s.cpf,
            deviceId: s.device_id,
          })),
        },
        recentEvents: eventsRes.data.data || [],
      };
    } catch (error: any) {
      logger.error(`Failed to get class details: ${error.message}`);
      throw { status: 500, message: 'Failed to fetch class details' };
    }
  }
}
