import { PersonasGateway } from '../../infrastructure/gateways/PersonasGateway';
import { CoreGateway } from '../../infrastructure/gateways/CoreGateway';
import { AttendanceRecordDTO, ErrorResponse } from '../../shared/dto';
import { logger } from '../../infrastructure/logger';

export class RegisterAttendanceBffUseCase {
  private personasGateway: PersonasGateway;
  private coreGateway: CoreGateway;
  constructor(personasGateway: PersonasGateway, coreGateway: CoreGateway) {
    this.personasGateway = personasGateway;
    this.coreGateway = coreGateway;
  }

  async execute({ device_id, qr_token, location, device_time, student_cpf }: {
    device_id: string;
    qr_token: string;
    location?: { latitude: number; longitude: number };
    device_time?: string;
    student_cpf?: string;
  }): Promise<AttendanceRecordDTO | ErrorResponse> {
    try {
      // 1. Check device registration
  let student: { id: any; cpf: any; device_id?: string | null };
      try {
        const studentRes = await this.personasGateway.getStudentByDevice(device_id);
        student = studentRes.data?.data;
      } catch (err: any) {
        // Treat 404 as device not registered
        if (err.response && err.response.status === 404) {
          if (!student_cpf) {
            return { code: 'device_not_registered', message: 'Device not registered. Please provide student CPF.' };
          }
          // If CPF provided, check student exists and matches device
          try {
            const studentsRes = await this.personasGateway.getStudentByCpf(student_cpf);
            student = studentsRes.data?.data;
            if (!student) {
              return { code: 'student_not_found', message: 'Student not found for provided CPF.' };
            }
            // Validate device association
            if (student.device_id && student.device_id !== device_id) {
              return { code: 'device_mismatch', message: 'Student already has a different device registered.' };
            }
            // Get event to extract class_id
            const eventRes = await this.coreGateway.getEventFromQrToken(qr_token);
            if (eventRes.status !== 200 || !eventRes.data?.data) {
              return { code: 'event_not_found', message: 'Event not found for QR token.' };
            }
            const event = eventRes.data.data;
            const classId = event.class_id;
            // Check student is in class
            const classStudentsRes = await this.personasGateway.getClassStudents(classId);
            const students = classStudentsRes.data?.data || [];
            const isInClass = students.some((s: any) => s.id === student.id);
            if (!isInClass) {
              return { code: 'student_not_in_class', message: 'Student is not enrolled in this class.' };
            }
            // register student device
            if (!student.device_id) {
              try {
                await this.personasGateway.updateStudentDevice(student.id, device_id);
              } catch (err) {
                logger.error(`Failed to associate device to student before attendance: ${(err as Error).message}`);
              }
            }
            // Register attendance
            return await this.registerAttendance({ qr_token, device_id, student_cpf: student.cpf, location, device_time });
          } catch (cpfErr: any) {
            logger.error(`Failed to get student by CPF: ${cpfErr.message}`);
            return { code: 'student_not_found', message: 'Student not found for provided CPF.' };
          }
        } else {
          logger.error(`Failed to get student by device: ${err.message}`);
          return { code: 'internal_error', message: 'Failed to get student by device.' };
        }
      }
      if (!student) {
        return { code: 'student_not_found', message: 'Student not found for device.' };
      }
      // 2. Get event to extract class_id
      const eventRes = await this.coreGateway.getEventFromQrToken(qr_token);
      if (eventRes.status !== 200 || !eventRes.data?.data) {
        return { code: 'event_not_found', message: 'Event not found for QR token.' };
      }
      const event = eventRes.data.data;
      const classId = event.class_id;
      // 3. Check student is in class
      const classStudentsRes = await this.personasGateway.getClassStudents(classId);
      const students = classStudentsRes.data?.data || [];
      const isInClass = students.some((s: any) => s.id === student.id);
      if (!isInClass) {
        return { code: 'student_not_in_class', message: 'Student is not enrolled in this class.' };
      }
      // Register attendance
      return await this.registerAttendance({ qr_token, device_id, student_cpf: student.cpf, location, device_time });
    } catch (error: any) {
      logger.error(`Failed to register attendance: ${error.message}`);
      return { code: 'internal_error', message: 'Failed to register attendance.' };
    }
  }

  private async registerAttendance(payload: any): Promise<AttendanceRecordDTO | ErrorResponse> {
    try {
      const res = await this.coreGateway.registerAttendance(payload);
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        // Student already attendant
        return { code: 'already_attendant', message: 'Student has already registered attendance for this event.' };
      }
      logger.error(`Core registerAttendance failed: ${error.message}`);
      return { code: 'core_error', message: 'Failed to register attendance in Core.' };
    }
  }
}
