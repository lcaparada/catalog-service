import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { RabbitMQ } from './rabbitmq';

const EXCHANGE = 'catalog.events';

export class RabbitMQEventPublisher implements EventPublisher {
  async publish(eventName: string, payload: object): Promise<void> {
    const channel = RabbitMQ.getChannel();
    const message = Buffer.from(JSON.stringify(payload));
    const published = channel.publish(EXCHANGE, eventName, message, {
      persistent: true,
      contentType: 'application/json',
    });
    if (!published) {
      throw new Error(`RabbitMQ: failed to publish event ${eventName}`);
    }
  }
}
