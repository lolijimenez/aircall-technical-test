export interface MailServicePort {
  sendMessage(destination: string, message: string): void;
}