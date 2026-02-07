import { RabbitMQ } from './rabbitmq';
import { RabbitMQEventPublisher } from './rabbitmq-event-publisher';

jest.mock('./rabbitmq', () => ({
  RabbitMQ: {
    getChannel: jest.fn(),
  },
}));

describe('RabbitMQEventPublisher unit tests', () => {
  const mockPublish = jest.fn().mockReturnValue(true);
  const mockChannel = { publish: mockPublish };

  beforeEach(() => {
    jest.clearAllMocks();
    (RabbitMQ.getChannel as jest.Mock).mockReturnValue(mockChannel);
  });

  describe('publish', () => {
    it('should get channel and publish message to exchange with routing key', async () => {
      const publisher = new RabbitMQEventPublisher();
      const eventName = 'catalog.product.created';
      const payload = { id: '1', name: 'Product', price: 100 };

      await publisher.publish(eventName, payload);

      expect(RabbitMQ.getChannel).toHaveBeenCalledTimes(1);
      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockPublish).toHaveBeenCalledWith(
        'catalog.events',
        eventName,
        Buffer.from(JSON.stringify(payload)),
        {
          persistent: true,
          contentType: 'application/json',
        }
      );
    });

    it('should serialize payload as JSON', async () => {
      const publisher = new RabbitMQEventPublisher();
      const payload = { id: '2', count: 5 };

      await publisher.publish('catalog.product.updated', payload);

      const buffer = mockPublish.mock.calls[0][2];
      expect(buffer).toBeInstanceOf(Buffer);
      expect(JSON.parse(buffer.toString())).toEqual(payload);
    });

    it('should throw when channel.publish returns false', async () => {
      mockPublish.mockReturnValueOnce(false);
      const publisher = new RabbitMQEventPublisher();

      await expect(
        publisher.publish('catalog.product.deleted', { id: '1' })
      ).rejects.toThrow('RabbitMQ: failed to publish event catalog.product.deleted');
    });
  });
});
