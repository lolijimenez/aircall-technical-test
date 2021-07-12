export interface SMSServicePort {
  sendMessage(destination: string, message: string): void;
}