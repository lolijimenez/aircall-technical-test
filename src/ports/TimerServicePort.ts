export interface TimerServicePort {
  //Use name to identify de timer
  setTimer(seconds: number, name: string): void;
  removeTimer(name: string): void;
}