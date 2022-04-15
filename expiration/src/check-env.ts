export enum ENV {
  NATS_URL = 'NATS_URL',
  NATS_CLUSTER_ID = 'NATS_CLUSTER_ID',
  NATS_CLIENT_ID = 'NATS_CLUSTER_ID',
  REDIS_HOST = 'REDIS_HOST',
}

export const checkMandatoryEnvSetup = (envs: ENV[]) => {
  for (let env of envs) {
    if (!process.env[env]) throw new Error(`${env} must be defined`);
  }
};
