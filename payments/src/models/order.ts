import { Document, Model, model, Schema, SchemaOptions, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@hngittix/common';

// An interface the describes the properties required to create an Order
interface OrderAttrs {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  status: OrderStatus;
  price: number;
  version: number;
}

// An interface that describes the properties that an Order Document has
export interface OrderDoc extends Document {
  userId: Types.ObjectId;
  status: OrderStatus;
  price: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties that an Order Model has
interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
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

const orderSchema = new Schema<OrderDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true },
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
orderSchema.static('build', (attrs: OrderAttrs) =>
  attrs.id ? new Order({ ...attrs, _id: attrs.id }) : new Order(attrs)
);

// -------------------
// COMPILE MODEL
export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);
