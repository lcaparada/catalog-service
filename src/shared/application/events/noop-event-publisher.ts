import { EventPublisher } from './event-publisher.interface';

export class NoOpEventPublisher implements EventPublisher {
  async publish(_eventName: string, _payload: object): Promise<void> {}
}
