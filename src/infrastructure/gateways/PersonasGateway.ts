
import axios from 'axios';

export class PersonasGateway {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTeacherClasses(email: string) {
    // Correct: GET /classes?teacher_email={email}
    return axios.get(`${this.baseUrl}/classes`, { params: { teacher_email: email } });
  }

  // POST /teachers/login
  async teacherLogin(email: string, password: string) {
    return axios.post(`${this.baseUrl}/teachers/login`, { email, password });
  }

  // POST /teachers/recover-password
  async teacherRecoverPassword(teacher_email: string) {
    return axios.post(`${this.baseUrl}/teachers/recover-password`, { teacher_email });
  }

  async getClass(classId: number) {
    return axios.get(`${this.baseUrl}/classes/${classId}`);
  }

  async getClassStudents(classId: number) {
    return axios.get(`${this.baseUrl}/classes/${classId}/students`);
  }

  async getClassTeachers(classId: number) {
    return axios.get(`${this.baseUrl}/classes/${classId}/teachers`);
  }

  // PUT /students/{studentId} to update device association
  async updateStudentDevice(studentId: number, deviceId: string | null) {
    return axios.put(`${this.baseUrl}/students/${studentId}`, { device_id: deviceId });
  }

    // GET /students/device?device_id=...
    async getStudentByDevice(deviceId: string) {
      return axios.get(`${this.baseUrl}/students/device`, { params: { device_id: deviceId } });
    }

   // GET /students/cpf/{cpf}
    async getStudentByCpf(cpf: string) {
      return axios.get(`${this.baseUrl}/students/cpf/${cpf}`);
    }
}
