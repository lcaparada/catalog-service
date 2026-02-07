import amqp from 'amqplib';
import { RabbitMQ } from './rabbitmq';

jest.mock('amqplib');

describe('RabbitMQ unit tests', () => {
  const mockAssertExchange = jest.fn().mockResolvedValue(undefined);
  const mockChannelClose = jest.fn().mockResolvedValue(undefined);
  const mockConnectionClose = jest.fn().mockResolvedValue(undefined);

  const mockChannel = {
    assertExchange: mockAssertExchange,
    close: mockChannelClose,
    publish: jest.fn().mockReturnValue(true),
  };

  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
    close: mockConnectionClose,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await RabbitMQ.disconnect().catch(() => {});
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(async () => {
    await RabbitMQ.disconnect().catch(() => {});
  });

  describe('connect', () => {
    it('should call amqp.connect with provided uri', async () => {
      const uri = 'amqp://localhost:5672';

      await RabbitMQ.connect(uri);

      expect(amqp.connect).toHaveBeenCalledWith(uri);
    });

    it('should create channel and assert exchange catalog.events', async () => {
      await RabbitMQ.connect('amqp://localhost:5672');

      expect(mockConnection.createChannel).toHaveBeenCalledTimes(1);
      expect(mockAssertExchange).toHaveBeenCalledWith(
        'catalog.events',
        'topic',
        { durable: true }
      );
    });

    it('should return channel instance', async () => {
      const result = await RabbitMQ.connect('amqp://localhost:5672');

      expect(result).toBe(mockChannel);
    });
  });

  describe('getChannel', () => {
    it('should throw when not connected', () => {
      expect(() => RabbitMQ.getChannel()).toThrow(
        'RabbitMQ not connected. Call connect() first.'
      );
    });

    it('should return channel after connect', async () => {
      await RabbitMQ.connect('amqp://localhost:5672');

      const channel = RabbitMQ.getChannel();

      expect(channel).toBe(mockChannel);
    });
  });

  describe('disconnect', () => {
    it('should close channel and connection', async () => {
      await RabbitMQ.connect('amqp://localhost:5672');
      await RabbitMQ.disconnect();

      expect(mockChannelClose).toHaveBeenCalledTimes(1);
      expect(mockConnectionClose).toHaveBeenCalledTimes(1);
    });

    it('should not throw when getChannel after disconnect', async () => {
      await RabbitMQ.connect('amqp://localhost:5672');
      await RabbitMQ.disconnect();

      expect(() => RabbitMQ.getChannel()).toThrow(
        'RabbitMQ not connected. Call connect() first.'
      );
    });

    it('should not throw when disconnect without prior connect', async () => {
      await expect(RabbitMQ.disconnect()).resolves.not.toThrow();
    });
  });
});
