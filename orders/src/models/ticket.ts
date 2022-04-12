import { Schema, SchemaOptions, model, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus, TicketUpdatedEvent } from '@hngittix/common';

import { Order } from './order';

// An interface the describes the properties required to create a ticket
interface TicketAttrs {
  id?: string;
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket Document has
export interface TicketDoc extends Document {
  // id: string;
  title: string;
  price: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEventData(eventData: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

// ------------------
// SCHEMA
const schemaOptions: SchemaOptions = {
  timestamps: { createdAt: true, updatedAt: true },
  // versionKey: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};

const ticketSchema = new Schema<TicketDoc>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  schemaOptions
);

// -------------------
// PLUGINS
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// -------------------
// STATIC METHODS
ticketSchema.static('build', (attrs: TicketAttrs) =>
  attrs.id
    ? new Ticket({
        _id: attrs.id,
        ...attrs,
      })
    : new Ticket(attrs)
);

ticketSchema.static(
  'findByEventData',
  async (eventData: { id: string; version: number }) => {
    const ticket = await Ticket.findById(eventData.id);
    return !ticket || ticket.version !== eventData.version - 1 ? null : ticket;
  }
);

// -------------------
// INSTANCE METHODS
// a reserved ticket has an order with any status that is not 'canceled'
ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const ticket = this;

  const existingOrder = await Order.findOne({
    ticket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

// -------------------
// COMPILE MODEL
export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
