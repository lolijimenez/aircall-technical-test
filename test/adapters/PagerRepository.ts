import { PagerRepositoryPort, Dysfunction } from '../../src/ports/PagerRepositoryPort';

export class PagerRepository implements PagerRepositoryPort {
  getLast(serviceId: number): Promise<Dysfunction | null> {
    switch (serviceId) {
      case 3:
        return Promise.resolve(
          {
            serviceId: serviceId,
            isHealthy: false,
            escalationLevel: 1,
            message: 'Test message',
            accepted: false
          }
        );
      case 4:
        return Promise.resolve(
          {
            serviceId: serviceId,
            isHealthy: false,
            escalationLevel: 1,
            message: 'Test message',
            accepted: true
          }
        );
      case 5:
        return Promise.resolve(
          {
            serviceId: serviceId,
            isHealthy: true,
            escalationLevel: 1,
            message: 'Test message',
            accepted: true
          }
        );
      case 6:
        return Promise.resolve(
          {
            serviceId: serviceId,
            isHealthy: false,
            escalationLevel: 1,
            message: 'Test message',
            accepted: false
          }
        );
      case 7:
        return Promise.resolve(
          {
            serviceId: serviceId,
            isHealthy: false,
            escalationLevel: 2,
            message: 'Test message',
            accepted: false
          }
        );
      default:
        return Promise.resolve(null);
    }
  }

  create(entry: Dysfunction): Promise<boolean> {
    return Promise.resolve(true);
  }

  update(entry: Dysfunction): Promise<void> {
    return Promise.resolve();
  }
}