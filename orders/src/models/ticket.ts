import { Schema, SchemaOptions, model, Model, Document } from 'mongoose';
import { OrderStatus } from '@hngittix/common';

import { Order } from './order';

// An interface the describes the properties required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket Document has
export interface TicketDoc extends Document {
  title: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// ------------------
// SCHEMA
const schemaOptions: SchemaOptions = {
  timestamps: { createdAt: true, updatedAt: true },
  versionKey: false,
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
// STATIC METHODS
ticketSchema.static('build', (attrs: TicketAttrs) => new Ticket(attrs));

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
