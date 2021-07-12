import { TimerServicePort } from '../../src/ports/TimerServicePort';

export class TimerService implements TimerServicePort {
  setTimer(seconds: number, name: string): void {
    console.log('Timer start');
  }

  removeTimer(name: string): void {
    console.log('Timer removed');
  }
}