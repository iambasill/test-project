export interface ExchangeConfig {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
  options: {
    durable: boolean;
  };
}

export const EXCHANGES: Record<string, ExchangeConfig> = {
  NOTIFICATIONS: {
    name: 'notifications-exchange',
    type: 'topic',
    options: { durable: true }
  }
};