export default {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['dotenv/config'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./src/test/setup.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'node',
};
