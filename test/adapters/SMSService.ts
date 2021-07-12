import { SMSServicePort } from '../../src/ports/SMSServicePort';

export class SMSService implements SMSServicePort {
  sendMessage(destination: string, message: string): void {
    console.log(`SMS sent to ${destination}`);
  }
}