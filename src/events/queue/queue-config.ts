export interface QueueConfig {
  name: string;
  options: {
    durable: boolean;
    deadLetterExchange?: string;
  };
}

export const QUEUES: Record<string, QueueConfig> = {
  EMAIL: {
    name: 'email-queue',
    options: { durable: true }
  },
  SMS: {
    name: 'sms-queue',
    options: { durable: true }
  }
};