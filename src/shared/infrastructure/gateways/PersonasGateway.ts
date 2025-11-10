
import axios, { AxiosInstance } from 'axios';
import { logger } from '../../logger';

const DEFAULT_RETRIES = 2;

export class PersonasGateway {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 5000 });
    this.client.interceptors.response.use(r => r, err => {
      if (err.code === 'ECONNREFUSED') {
        logger.error(`Personas service unreachable at ${this.baseUrl}`);
        err.status = 503;
        err.message = 'Personas service unavailable';
      }
      return Promise.reject(err);
    });
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = DEFAULT_RETRIES): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (err: any) {
        if (err.status === 404 || err.code === 'ECONNREFUSED') throw err;
        if (attempt >= retries) throw err;
        attempt++;
        logger.info(`Retrying Personas request (attempt ${attempt}/${retries}) due to: ${err.message}`);
        await new Promise(r => setTimeout(r, 150 * attempt));
      }
    }
  }

  async getTeacherClasses(email: string) {
    return this.withRetry(() => this.client.get('/classes', { params: { teacher_email: email } }));
  }

  async teacherLogin(email: string, password: string) {
    return this.withRetry(() => this.client.post('/teachers/login', { email, password }));
  }

  async teacherRecoverPassword(teacher_email: string) {
    return this.withRetry(() => this.client.post('/teachers/recover-password', { teacher_email }));
  }

  async getClass(classId: number) {
    return this.withRetry(() => this.client.get(`/classes/${classId}`));
  }

  async getClassStudents(classId: number) {
    return this.withRetry(() => this.client.get(`/classes/${classId}/students`));
  }

  async getClassTeachers(classId: number) {
    return this.withRetry(() => this.client.get(`/classes/${classId}/teachers`));
  }

  async updateStudentDevice(studentId: number, deviceId: string | null) {
    return this.withRetry(() => this.client.put(`/students/${studentId}`, { device_id: deviceId }));
  }

  async getStudentByDevice(deviceId: string) {
    return this.withRetry(() => this.client.get('/students/device', { params: { device_id: deviceId } }));
  }

  async getStudentByCpf(cpf: string) {
    return this.withRetry(() => this.client.get(`/students/cpf/${cpf}`));
  }
}
