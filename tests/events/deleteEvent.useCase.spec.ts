import { DeleteEventUseCase } from '../../src/features/events/deleteEvent/useCase';
import { CoreGateway } from '../../src/shared/infrastructure/gateways/CoreGateway';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const describe: any, it: any, expect: any, beforeEach: any, jest: any;

jest.mock('../../src/shared/infrastructure/gateways/CoreGateway');
const MockedGateway: any = CoreGateway as any;

describe('DeleteEventUseCase', () => {
  let gateway: CoreGateway;
  let useCase: DeleteEventUseCase;

  beforeEach(() => {
    gateway = new MockedGateway('http://core');
    useCase = new DeleteEventUseCase(gateway);
  });

  it('should validate eventId', async () => {
    await expect(useCase.execute('')).rejects.toHaveProperty('status', 400);
  });

  it('should call gateway.deleteEvent', async () => {
    (gateway.deleteEvent as any).mockResolvedValue({ status: 204 });
    await useCase.execute('e99');
    expect(gateway.deleteEvent).toHaveBeenCalledWith('e99');
  });
});
