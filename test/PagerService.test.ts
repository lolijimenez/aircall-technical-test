import { PagerService } from '../src/PagerService';
import TestUtils from './TestUtils';

describe('Open incident', () => {
  let pagerService: PagerService;

  beforeAll(() => {
    pagerService = TestUtils.createPagerService();
  });

  test('Open incident for healthy service (serviceId 1)', async () => {
    const result = await pagerService.openIncident(1, 'Test message');
    expect(result).toBe(true);
  });

  test('Open incident for healthy service without escalation levels configured (serviceId 2)', async () => {
    let message = '';
    try {
      await pagerService.openIncident(2, 'Test message');
    } catch (error) {
      message = error.message;
    }
    expect(message).toBe('Level not found in escalation policy!');
  });

  test('Open incident for unhealthy service (serviceId 3)', async () => {
    const result = await pagerService.openIncident(3, 'Test message');
    expect(result).toBe(false);
  });
});

describe('Accept incident', () => {
  let pagerService: PagerService;

  beforeAll(() => {
    pagerService = TestUtils.createPagerService();
  });

  test('Accept incident (serviceId 3)', async () => {
    const result = await pagerService.acceptIncident(3);
    expect(result).toBe(true);
  });

  test('Accept incident for healthy service (serviceId 1)', async () => {
    const result = await pagerService.acceptIncident(1);
    expect(result).toBe(false);
  });

  test('Accept incident already accepted (serviceId 4)', async () => {
    const result = await pagerService.acceptIncident(4);
    expect(result).toBe(false);
  });
});

describe('Close incident', () => {
  let pagerService: PagerService;

  beforeAll(() => {
    pagerService = TestUtils.createPagerService();
  });

  test('Close incident (serviceId 4)', async () => {
    const result = await pagerService.closeIncident(4);
    expect(result).toBe(true);
  });

  test('Close invalid incident (serviceId 1)', async () => {
    let message = '';
    try {
      await pagerService.closeIncident(1);
    } catch (error) {
      message = error.message;
    }
    expect(message).toBe('Service is working well');
  });

  test('Close incident already closed (serviceId 5)', async () => {
    let message = '';
    try {
      await pagerService.closeIncident(5);
    } catch (error) {
      message = error.message;
    }
    expect(message).toBe('Service is working well');
  });
});

describe('Refresh incident', () => {
  let pagerService: PagerService;

  beforeAll(() => {
    pagerService = TestUtils.createPagerService();
  });

  test('Refresh incident to level 2 (serviceId 6)', async () => {
    const result = await pagerService.refreshIncident(6);
    expect(result).toBe(true);
  });

  test('Refresh incident for service with only one level configured (serviceId 3)', async () => {
    const result = await pagerService.refreshIncident(3);
    expect(result).toBe(true);
  });

  test('Refresh incident - Return to level 1 (serviceId 7)', async () => {
    const result = await pagerService.refreshIncident(7);
    expect(result).toBe(true);
  });

  test('Refresh incident already closed (serviceId 5)', async () => {
    const result = await pagerService.refreshIncident(5);
    expect(result).toBe(false);
  });

  test('Refresh incident invalid (serviceId 1)', async () => {
    const result = await pagerService.refreshIncident(1);
    expect(result).toBe(false);
  });

  test('Refresh incident already accepted (serviceId 4)', async () => {
    const result = await pagerService.refreshIncident(4);
    expect(result).toBe(false);
  });
});

