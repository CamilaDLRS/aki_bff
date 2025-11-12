import { CoreGateway } from '../../../shared/infrastructure/gateways/CoreGateway';
import { PersonasGateway } from '../../../shared/infrastructure/gateways/PersonasGateway';
import { EventDTO, AttendanceRecordDTO, StudentDTO } from '../../../shared/dto';
import { logger } from '../../../shared/logger';

export class GetEventDetailsUseCase {
  private coreGateway: CoreGateway;
  private personasGateway: PersonasGateway;
  constructor(coreGateway: CoreGateway, personasGateway: PersonasGateway) {
    this.coreGateway = coreGateway;
    this.personasGateway = personasGateway;
  }

  async execute(eventId: string): Promise<{ event: EventDTO; attendance: AttendanceRecordDTO[] }> {
    try {
      const eventRes = await this.coreGateway.getEvent(eventId);
      if (!eventRes.data.data) {
        throw new Error('Event not found');
      }
      const e = eventRes.data.data;
      const event = {
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

      const attendanceRes = await this.coreGateway.getEventAttendance(eventId);
      const attendanceList = attendanceRes.data.data || [];

      const studentsRes = await this.personasGateway.getClassStudents(e.class_id);
      const students = studentsRes.data.data || [];

      // Enrich attendance with student names and map fields
      const attendance = attendanceList.map((a: any) => ({
        studentId: a.student_id,
        studentName: students.find((s: { id: any; }) => s.id === a.student_id)?.full_name || '',
        status: a.status,
        recordedAt: a.timestamp,
      }));
      return { event, attendance };
    } catch (error: any) {
      console.log(error);
      logger.error(`Failed to get event details: ${error.message}`);
      throw { status: 500, message: 'Failed to fetch event details' };
    }
  }
}
