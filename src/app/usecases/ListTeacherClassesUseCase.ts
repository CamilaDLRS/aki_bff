import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { ClassDTO } from '../../shared/dto';
import { logger } from '../../infrastructure/logger';

export class ListTeacherClassesUseCase {
  private personasGateway: PersonasGateway;
  constructor(personasGateway: PersonasGateway) {
    this.personasGateway = personasGateway;
  }

  async execute(teacherEmail: string): Promise<ClassDTO[]> {
    try {
      const response = await this.personasGateway.getTeacherClasses(teacherEmail);
      const classes = response.data.data as any[];
      // For each class, fetch full details to get teachers and students
      const detailedClasses = await Promise.all(classes.map(async (cls) => {
        const detailRes = await this.personasGateway.getClass(cls.id);
        const detail = detailRes.data.data;
        return {
          id: detail.id,
          code: detail.code,
          name: detail.name,
          teachers: (detail.teachers || []).map((t: any) => ({
            id: t.id,
            fullName: t.full_name,
            email: t.email,
          })),
          students: (detail.students || []).map((s: any) => ({
            id: s.id,
            fullName: s.full_name,
            cpf: s.cpf,
            deviceId: s.device_id,
          })),
        };
      }));
      return detailedClasses;
    } catch (error: any) {
      logger.error(`Failed to list classes for teacher ${teacherEmail}: ${error.message}`);
      throw { status: 500, message: 'Failed to fetch teacher classes' };
    }
  }
}
