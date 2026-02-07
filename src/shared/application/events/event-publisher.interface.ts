export interface EventPublisher {
  publish(eventName: string, payload: object): Promise<void>;
}
