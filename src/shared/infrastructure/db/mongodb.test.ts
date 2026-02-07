import { Db, MongoClient } from 'mongodb';
import { MongoDB } from './mongodb';

jest.mock('mongodb');

describe('MongoDB unit tests', () => {
  const mockConnect = jest.fn();
  const mockClose = jest.fn();
  const mockDb = jest.fn();

  const mockDbInstance = {} as Db;

  beforeEach(() => {
    jest.clearAllMocks();
    (MongoClient as jest.MockedClass<typeof MongoClient>).mockImplementation(
      () =>
        ({
          connect: mockConnect.mockResolvedValue(undefined),
          close: mockClose.mockResolvedValue(undefined),
          db: mockDb.mockReturnValue(mockDbInstance),
        }) as unknown as MongoClient
    );
  });

  describe('connect', () => {
    it('should create MongoClient with provided uri', async () => {
      const uri = 'mongodb://localhost:27017/test';

      await MongoDB.connect(uri);

      expect(MongoClient).toHaveBeenCalledWith(uri);
    });

    it('should call connect on client', async () => {
      await MongoDB.connect('mongodb://localhost:27017');

      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('should return db instance', async () => {
      const result = await MongoDB.connect('mongodb://localhost:27017');

      expect(mockDb).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockDbInstance);
    });

    it('should throw when connect fails', async () => {
      mockConnect.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(MongoDB.connect('mongodb://invalid')).rejects.toThrow(
        'Connection failed'
      );
    });
  });

  describe('disconnect', () => {
    it('should close client connection', async () => {
      await MongoDB.connect('mongodb://localhost:27017');
      await MongoDB.disconnect();

      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('should throw when close fails', async () => {
      await MongoDB.connect('mongodb://localhost:27017');
      mockClose.mockRejectedValueOnce(new Error('Close failed'));

      await expect(MongoDB.disconnect()).rejects.toThrow('Close failed');
    });
  });
});
