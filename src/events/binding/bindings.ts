export interface BindingConfig {
  queue: string;
  exchange: string;
  routingKey: string;
}

export const BINDINGS: BindingConfig[] = [
  {
    queue: 'email-queue',
    exchange: 'notifications-exchange',
    routingKey: 'notification.email'
  },
  {
    queue: 'sms-queue',
    exchange: 'notifications-exchange',
    routingKey: 'notification.sms'
  }
];