import { connect, Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// Create a client
// This client is connecting to the nats-streaming-server inside the pod of the kubernetes
// For dev purpose, setup port forwarding:
// kubectl port-forward [nats_pod_name] 4222:4222
const clientID = randomBytes(4).toString('hex');
const stan = connect('gittix', clientID, { url: 'http://localhost:4222' });

stan.on('connect', () => {
  console.log('✅✅✅ LISTENER connected to NATS ✅✅✅');

  const options = stan.subscriptionOptions().setManualAckMode(true); //manually tells nats streaming server that the event is process;

  // the queue group only send events to one of the instances subscribe to the queue group
  const subscription = stan.subscribe(
    'ticket:created',
    'listenerQueueGroup',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event ${msg.getSequence()}, with data: ${data}`);
    }

    // Manually acknowledge event processed
    // setManualAckMode(true) must be chained to stan.subscriptionOptions()
    msg.ack();
  });
});
