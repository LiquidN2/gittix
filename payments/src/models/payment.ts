import { Document, Model, model, Schema, SchemaOptions, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface the describes the properties required to create a Payment
interface PaymentAttrs {
  order: Types.ObjectId;
  stripeChargeId: string;
}

// An interface that describes the properties that a Payment Document has
export interface PaymentDoc extends Document {
  order: Types.ObjectId;
  stripeChargeId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties that a Payment Model has
interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
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

const PaymentSchema = new Schema<PaymentDoc>(
  {
    order: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
    stripeChargeId: { type: String, required: true },
  },
  schemaOptions
);

// -------------------
// PLUGINS
PaymentSchema.set('versionKey', 'version');
PaymentSchema.plugin(updateIfCurrentPlugin);

// -------------------
// STATIC METHODS
PaymentSchema.static('build', (attrs: PaymentAttrs) => new Payment(attrs));

// -------------------
// COMPILE MODEL
export const Payment = model<PaymentDoc, PaymentModel>(
  'Payment',
  PaymentSchema
);
