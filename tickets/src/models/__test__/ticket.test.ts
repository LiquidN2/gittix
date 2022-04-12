import { Types } from 'mongoose';
import { Ticket } from '../ticket';

const { ObjectId } = Types;

describe('MODELS Ticket', () => {
  it('implements optimistics concurrency conrtol', async () => {
    // create a new ticket
    const ticket = Ticket.build({
      title: 'test title',
      price: 15,
      userId: new ObjectId(),
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    // Update the ticket;
    ticket.price = 18;
    await ticket.save();

    ticket.title = 'updated ticket title';
    await ticket.save();

    expect(ticket.version).toEqual(2);
  });
});
