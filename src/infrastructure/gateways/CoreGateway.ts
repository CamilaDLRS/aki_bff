import axios from 'axios';

export class CoreGateway {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getClassEvents(classId: number, limit?: number) {
    // Example: GET /events?class_id={classId}&size={limit}
    return axios.get(`${this.baseUrl}/events`, { params: { class_id: classId, size: limit } });
  }

  async getEvent(eventId: string) {
    return axios.get(`${this.baseUrl}/events/${eventId}`);
  }

  async getEventAttendance(eventId: string) {
    return axios.get(`${this.baseUrl}/attendances`, { params: { event_id: eventId } });
  }

  async registerAttendance(payload: any) {
    return axios.post(`${this.baseUrl}/attendances`, payload);
  }

  async getEventFromQrToken(qrToken: string) {
    return axios.get(`${this.baseUrl}/v1/events/by-qr`, { params: { qr_token: qrToken } });
  }

  async createEvent(payload: {
    class_id: number;
    teacher_id: number;
    start_time: string;
    end_time: string;
    location: { latitude: number; longitude: number };
  }) {
    // Core spec: POST /events returns 201 + Event
    return axios.post(`${this.baseUrl}/events`, payload);
  }
}
