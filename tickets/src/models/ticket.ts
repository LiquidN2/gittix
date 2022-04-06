import { Schema, SchemaOptions, model, Model, Document, Types } from 'mongoose';

// An interface the describes the properties required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: Types.ObjectId;
}

// An interface that describes the properties that a Ticket Document has
export interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
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
    price: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  schemaOptions
);

// -------------------
// STATIC METHODS
ticketSchema.static('build', (attrs: TicketAttrs) => new Ticket(attrs));

// -------------------
// COMPILE MODEL
export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
