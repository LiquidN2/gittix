import { RedisMemoryServer } from 'redis-memory-server';

jest.mock('../nats-wrapper');

let redisServer: RedisMemoryServer;

beforeAll(async () => {
  // setup Redis server
  redisServer = new RedisMemoryServer({
    instance: { port: 6379 },
  });

  await redisServer.getHost(); // defaults 127.0.0.1
  await redisServer.getPort();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // stops redis server
  await redisServer.stop();
});
