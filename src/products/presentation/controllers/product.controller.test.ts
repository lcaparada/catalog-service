import { bootstrap } from '@/server';
import { NoOpEventPublisher } from '@/shared/application/events/noop-event-publisher';
import { MongoDB } from '@/shared/infrastructure/db/mongodb/mongodb';
import { registerRoutes } from '@/products/presentation/routes';
import { FastifyInstance } from 'fastify';
import { Db } from 'mongodb';

const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const prefix = '/api/v1';

describe('ProductController Integration Tests', () => {
  let app: FastifyInstance;
  let db: Db;
  const collectionName = 'products';

  beforeAll(async () => {
    app = bootstrap();
    db = await MongoDB.connect(mongoUri);
    await registerRoutes(app, db, new NoOpEventPublisher());
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await MongoDB.disconnect();
  });

  beforeEach(async () => {
    await db.collection(collectionName).deleteMany({});
  });

  describe('POST /products', () => {
    it('should create product and return 201 with product data', async () => {
      const body = {
        name: 'Product Test',
        description: 'Description test',
        price: 100,
        stock: 10,
      };

      const response = await app.inject({
        method: 'POST',
        url: `${prefix}/products`,
        payload: body,
      });

      expect(response.statusCode).toBe(201);
      const json = response.json();
      expect(json).toMatchObject({
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
      });
      expect(json.id).toBeDefined();
      expect(typeof json.id).toBe('string');
      expect(json.createdAt).toBeDefined();
      expect(json.updatedAt).toBeDefined();
    });
  });

  describe('GET /products/:id', () => {
    it('should return 200 and product when id exists', async () => {
      const body = {
        name: 'Product Get',
        description: 'Desc',
        price: 50,
        stock: 5,
      };
      const createResponse = await app.inject({
        method: 'POST',
        url: `${prefix}/products`,
        payload: body,
      });
      expect(createResponse.statusCode).toBe(201);
      const created = createResponse.json();
      const id = created.id;
      expect(id).toBeDefined();

      const response = await app.inject({
        method: 'GET',
        url: `${prefix}/products/${id}`,
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.id).toBe(id);
      expect(json.name).toBe(body.name);
      expect(json.description).toBe(body.description);
      expect(json.price).toBe(body.price);
      expect(json.stock).toBe(body.stock);
    });

    it('should return 404 when product does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await app.inject({
        method: 'GET',
        url: `${prefix}/products/${fakeId}`,
      });

      expect(response.statusCode).toBe(404);
      const json = response.json();
      expect(json.statusCode).toBe(404);
      expect(json.message).toBeDefined();
    });
  });
});
