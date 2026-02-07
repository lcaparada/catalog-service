import amqp, { Channel, ChannelModel } from 'amqplib';

const EXCHANGE = 'catalog.events';
const EXCHANGE_TYPE = 'topic';

export class RabbitMQ {
  private static connection: ChannelModel | null = null;
  private static channel: Channel | null = null;

  static async connect(uri: string): Promise<Channel> {
    RabbitMQ.connection = await amqp.connect(uri);
    RabbitMQ.channel = await RabbitMQ.connection.createChannel();
    await RabbitMQ.channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, {
      durable: true,
    });
    return RabbitMQ.channel;
  }

  static getChannel(): Channel {
    if (!RabbitMQ.channel) {
      throw new Error('RabbitMQ not connected. Call connect() first.');
    }
    return RabbitMQ.channel;
  }

  static async disconnect(): Promise<void> {
    if (RabbitMQ.channel) {
      await RabbitMQ.channel.close();
      RabbitMQ.channel = null;
    }
    if (RabbitMQ.connection) {
      await RabbitMQ.connection.close();
      RabbitMQ.connection = null;
    }
  }
}
