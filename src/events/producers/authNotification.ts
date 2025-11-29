import amqp from 'amqplib';

// interface EmailPayload {
//   to: string;
//   verificationLink: string;
//   userName?: string;
//   type: 'register' | 'reset';
// }

// let connection: amqp.Connection | null = null;
// let channel: amqp.Channel | null = null;
// const exchangeName = 'notifications-exchange';

// export const connectProducer = async (): Promise<void> => {
//   connection = await amqp.connect('amqp://localhost');
//   channel = await connection.createChannel();
  
//   await channel.assertExchange(exchangeName, 'topic', { 
//     durable: true 
//   });
  
//   console.log('Producer connected');
// };

// export const sendEmailNotification = async (payload: EmailPayload): Promise<void> => {
//   if (!channel) {
//     throw new Error('Producer not connected. Call connectProducer() first.');
//   }

//   const routingKey = 'notification.email';
//   const message = Buffer.from(JSON.stringify(payload));
  
//   channel.publish(
//     exchangeName,
//     routingKey,
//     message,
//     { persistent: true }
//   );
// };

// export const closeProducer = async (): Promise<void> => {
//   if (channel) await channel.close();
//   if (connection) await connection.close();
//   console.log('Producer disconnected');
// };