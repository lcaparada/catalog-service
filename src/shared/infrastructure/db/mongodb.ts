import { Db, MongoClient } from 'mongodb';

export class MongoDB {
  private static client: MongoClient;

  public static async connect(uri: string): Promise<Db> {
    MongoDB.client = new MongoClient(uri);
    await MongoDB.client.connect();
    return MongoDB.client.db();
  }

  public static async disconnect(): Promise<void> {
    await MongoDB.client.close();
  }
}
