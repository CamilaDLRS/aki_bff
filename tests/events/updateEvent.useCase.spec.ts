// Note: tests live under tests/, so we navigate back to src.
import { UpdateEventUseCase } from '../../src/features/events/updateEvent/useCase';
import { CoreGateway } from '../../src/shared/infrastructure/gateways/CoreGateway';
// Bring jest globals into TypeScript scope
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const describe: any, it: any, expect: any, beforeEach: any, jest: any;

jest.mock('../../src/shared/infrastructure/gateways/CoreGateway');

// Use any to avoid TS jest namespace typing issues due to tsconfig include
const MockedGateway: any = CoreGateway as any;

describe('UpdateEventUseCase', () => {
  let gateway: CoreGateway;
  let useCase: UpdateEventUseCase;

  beforeEach(() => {
    gateway = new MockedGateway('http://core');
    useCase = new UpdateEventUseCase(gateway);
  });

  it('should validate required fields', async () => {
    await expect(useCase.execute({ eventId: '' })).rejects.toHaveProperty('status', 400);
    await expect(useCase.execute({ eventId: '123' })).rejects.toHaveProperty('status', 400); // no fields
  });

  it('should map response to EventDTO', async () => {
  (gateway.updateEvent as any).mockResolvedValue({ data: { id: 'e1', class_id: 10, teacher_id: 5, start_time: '2024-01-01T10:00:00Z', end_time: '2024-01-01T11:00:00Z', status: 'active', location: { latitude: 1, longitude: 2 }, qr_token: 'qt', created_at: '2024', updated_at: '2024' } });
    const result = await useCase.execute({ eventId: 'e1', status: 'closed' });
    expect(result).toMatchObject({ id: 'e1', classId: 10, teacherId: 5 });
    expect(gateway.updateEvent).toHaveBeenCalledWith('e1', { status: 'closed' });
  });
});
