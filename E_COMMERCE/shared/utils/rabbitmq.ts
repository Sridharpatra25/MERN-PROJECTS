import amqp, { Channel, Connection, Message } from 'amqplib';
import { RabbitMQMessage } from '../types';

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;

  constructor(url: string = 'amqp://localhost:5672') {
    this.url = url;
  }

  /**
   * Connect to RabbitMQ and create a channel
   */
  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Create a queue if it doesn't exist
   */
  async createQueue(queueName: string, options: any = {}): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertQueue(queueName, {
      durable: true,
      ...options
    });
    console.log(`✅ Queue '${queueName}' created/verified`);
  }

  /**
   * Publish a message to a queue
   */
  async publishMessage(queueName: string, message: RabbitMQMessage): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    const success = this.channel.sendToQueue(queueName, messageBuffer, {
      persistent: true,
      correlationId: message.correlationId
    });

    if (success) {
      console.log(`📤 Message published to queue '${queueName}'`);
    } else {
      throw new Error('Failed to publish message to queue');
    }
  }

  /**
   * Publish a message to an exchange
   */
  async publishToExchange(exchangeName: string, routingKey: string, message: RabbitMQMessage): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertExchange(exchangeName, 'topic', { durable: true });
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    const success = this.channel.publish(exchangeName, routingKey, messageBuffer, {
      persistent: true,
      correlationId: message.correlationId
    });

    if (success) {
      console.log(`📤 Message published to exchange '${exchangeName}' with routing key '${routingKey}'`);
    } else {
      throw new Error('Failed to publish message to exchange');
    }
  }

  /**
   * Consume messages from a queue
   */
  async consumeMessages(
    queueName: string, 
    callback: (message: RabbitMQMessage) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.consume(queueName, async (msg: Message | null) => {
      if (msg) {
        try {
          const message: RabbitMQMessage = JSON.parse(msg.content.toString());
          console.log(`📥 Received message from queue '${queueName}':`, message.type);
          
          await callback(message);
          
          // Acknowledge the message
          this.channel?.ack(msg);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          // Reject the message and requeue it
          this.channel?.nack(msg, false, true);
        }
      }
    });

    console.log(`👂 Listening for messages on queue '${queueName}'`);
  }

  /**
   * Close the connection and channel
   */
  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    console.log('🔌 RabbitMQ connection closed');
  }

  /**
   * Get the channel instance
   */
  getChannel(): Channel | null {
    return this.channel;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}

// Export a singleton instance
export const rabbitMQClient = new RabbitMQClient();

// Common queue names
export const QUEUES = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  PAYMENT_PROCESSED: 'payment.processed',
  NOTIFICATION_SEND: 'notification.send'
} as const;

// Common exchange names
export const EXCHANGES = {
  USER_EVENTS: 'user.events',
  PRODUCT_EVENTS: 'product.events',
  ORDER_EVENTS: 'order.events',
  PAYMENT_EVENTS: 'payment.events'
} as const;
