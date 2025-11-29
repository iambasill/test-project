import amqp from 'amqplib';
import { EXCHANGES } from '../exchanges/exchange-config';
import { BINDINGS } from '../binding/bindings';
import { QUEUES } from '../queue/queue-config';

// export const createNotificationConsumer = () => {
//   let connection: amqp.Connection | null = null;
//   let channel: amqp.Channel | null = null;

//   const connect = async (): Promise<void> => {
//     connection = await amqp.connect('amqp://localhost');
//     channel = await connection.createChannel();
    
//     // Setup exchange
//     await channel.assertExchange(
//       EXCHANGES.NOTIFICATIONS.name,
//       EXCHANGES.NOTIFICATIONS.type,
//       EXCHANGES.NOTIFICATIONS.options
//     );
    
//     // Setup queues and bindings
//     for (const binding of BINDINGS) {
//       await channel.assertQueue(binding.queue, { durable: true });
//       await channel.bindQueue(
//         binding.queue,
//         binding.exchange,
//         binding.routingKey
//       );
//     }
    
//     console.log('Consumer connected and setup complete');
//   };

//   const consumeEmail = async (
//     handler: (payload: any) => Promise<void>
//   ): Promise<void> => {
//     if (!channel) {
//       throw new Error('Consumer not connected. Call connect() first.');
//     }
    
//     await channel.consume(QUEUES.EMAIL.name, async (message) => {
//       if (message) {
//         try {
//           const payload = JSON.parse(message.content.toString());
//           console.log('Processing email:', payload);
          
//           await handler(payload);
          
//           channel!.ack(message);
//           console.log('Email processed successfully');
//         } catch (error) {
//           console.error('Error processing email:', error);
//           channel!.nack(message, false, false);
//         }
//       }
//     });
    
//   };

//   const consumeSMS = async (
//     handler: (payload: any) => Promise<void>
//   ): Promise<void> => {
//     if (!channel) {
//       throw new Error('Consumer not connected. Call connect() first.');
//     }
    
//     await channel.consume(QUEUES.SMS.name, async (message) => {
//       if (message) {
//         try {
//           const payload = JSON.parse(message.content.toString());
//           console.log('Processing SMS:', payload);
          
//           await handler(payload);
          
//           channel!.ack(message);
//           console.log('SMS processed successfully');
//         } catch (error) {
//           console.error('Error processing SMS:', error);
//           channel!.nack(message, false, false);
//         }
//       }
//     });
    
//     console.log('Started consuming SMS queue');
//   };

//   const close = async (): Promise<void> => {
//     if (channel) await channel.close();
//     if (connection) await connection.close();
//     console.log('Consumer disconnected');
//   };

//   return {
//     connect,
//     consumeEmail,
//     consumeSMS,
//     close
//   };
// };