import { connect } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// Create a client
// This client is connecting to the nats-streaming-server inside the pod of the kubernetes
// For dev purpose, setup port forwarding:
// kubectl port-forward [nats_pod_name] 4222:4222
const clientID = randomBytes(4).toString('hex');
const stan = connect('gittix', clientID, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('✅✅✅ PUBLISHER connected to NATS ✅✅✅');

  const data = JSON.stringify({
    id: 'abc123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => console.log('Event published'));
});
