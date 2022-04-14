export enum ENV {
  JWT_SECRET = 'JWT_SECRET',
  JWT_ISSUER = 'JWT_ISSUER',
  JWT_AUDIENCE = 'JWT_AUDIENCE',
  JWT_EXPIRATION_TIME = 'JWT_EXPIRATION_TIME',
  NATS_URL = 'NATS_URL',
  NATS_CLUSTER_ID = 'NATS_CLUSTER_ID',
  NATS_CLIENT_ID = 'NATS_CLUSTER_ID',
}

export const checkMandatoryEnvSetup = (envs: ENV[]) => {
  for (let env of envs) {
    if (!process.env[env]) throw new Error(`${env} must be defined`);
  }
};
