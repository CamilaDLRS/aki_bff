// Shared DTOs for BFF responses
export interface TeacherDTO {
  id: number;
  fullName: string;
  email: string;
}

export interface StudentDTO {
  id: number;
  fullName: string;
  cpf: string;
  deviceId?: string | null;
}

export interface ClassDTO {
  id: number;
  code?: string;
  name: string;
  teachers: TeacherDTO[];
  students: StudentDTO[];
}

export interface EventDTO {
  id: number | string;
  classId: number;
  teacherId: number;
  startAt: string;
  endAt: string;
  status: string;
  location?: any;
  qrToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecordDTO {
  studentId: number;
  studentName: string;
  status: string;
  recordedAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
