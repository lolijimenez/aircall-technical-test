import { MailServicePort } from '../../src/ports/MailServicePort';

export class MailService implements MailServicePort {
  sendMessage(destination: string, message: string): void {
    console.log(`Mail sent to ${destination}`);
  }
}