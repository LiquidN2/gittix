import { Document, Model, model, Schema, SchemaOptions, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@hngittix/common';

import { Ticket, TicketDoc } from './ticket';

// An interface the describes the properties required to create an Order
interface OrderAttrs {
  ticket: TicketDoc;
  userId: Types.ObjectId;
  expiresAt: Date;
  status: OrderStatus;
}

// An interface that describes the properties that an Order Document has
export interface OrderDoc extends Document {
  ticket: TicketDoc;
  userId: Types.ObjectId;
  expiresAt: Date;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// An interface that describes the properties that an Order Model has
interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
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

const orderSchema = new Schema<OrderDoc>(
  {
    ticket: { type: Schema.Types.ObjectId, required: true, ref: 'Ticket' },
    userId: { type: Schema.Types.ObjectId, required: true },
    expiresAt: { type: Schema.Types.Date },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
  },
  schemaOptions
);

// -------------------
// PLUGINS
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

// -------------------
// STATIC METHODS
orderSchema.static('build', (attrs: OrderAttrs) => new Order(attrs));

// -------------------
// COMPILE MODEL
export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);
