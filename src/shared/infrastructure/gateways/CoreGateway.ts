import axios, { AxiosInstance } from 'axios';
import { logger } from '../../logger';

// Simple retry config
const DEFAULT_RETRIES = 2;

export class CoreGateway {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });
    this.client.interceptors.response.use(r => r, err => {
      // Map connection refused to 503
      if (err.code === 'ECONNREFUSED') {
        logger.error(`Core service unreachable at ${this.baseUrl}`);
        err.status = 503;
        err.message = 'Core service unavailable';
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
        if (err.status === 404 || err.code === 'ECONNREFUSED') throw err; // don't retry not found or refused after mapping
        if (attempt >= retries) throw err;
        attempt++;
        logger.info(`Retrying Core request (attempt ${attempt}/${retries}) due to: ${err.message}`);
        await new Promise(r => setTimeout(r, 150 * attempt));
      }
    }
  }

  async health(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  async getClassEvents(classId: number, limit?: number) {
    return this.withRetry(() => this.client.get('/events', { params: { class_id: classId, size: limit } }));
  }

  async getEvent(eventId: string) {
    return this.withRetry(() => this.client.get(`/events/${eventId}`));
  }

  async getEventAttendance(eventId: string) {
    return this.withRetry(() => this.client.get('/attendances', { params: { event_id: eventId } }));
  }

  async registerAttendance(payload: any) {
    return this.withRetry(() => this.client.post('/attendances', payload));
  }

  async getEventFromQrToken(qrToken: string) {
    return this.withRetry(() => this.client.get('/events/by-qr', { params: { qr_token: qrToken } }));
  }

  async createEvent(payload: {
    class_id: number;
    teacher_id: number;
    start_time: string;
    end_time: string;
    location: { latitude: number; longitude: number };
  }) {
    return this.withRetry(() => this.client.post('/events', payload));
  }

  async updateEvent(eventId: string, payload: {
    start_time?: string;
    end_time?: string;
    status?: string; // active | closed | canceled
  }) {
    return this.withRetry(() => this.client.put(`/events/${eventId}`, payload));
  }

  async deleteEvent(eventId: string) {
    return this.withRetry(() => this.client.delete(`/events/${eventId}`));
  }
}
