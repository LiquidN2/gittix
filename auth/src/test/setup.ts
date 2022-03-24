import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { User } from '../models/user';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Create a MongoDB instance
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();

  // Connect to MongoDB instance
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Get all collections
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    // Clean the collection
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Stop MongoDB instance
  if (mongod) {
    await mongod.stop();
  }

  // Close the connection
  await mongoose.connection.close();
});
