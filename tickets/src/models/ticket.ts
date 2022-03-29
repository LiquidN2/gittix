import { Schema, SchemaOptions, model, Model, Document } from 'mongoose';

// An interface the describes the properties required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket Document has
interface TicketDoc extends Document {
  title: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties that a User Model has
interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// ------------------
// SCHEMA
const schemaOptions: SchemaOptions = {
  timestamps: { createdAt: true, updatedAt: true },
  versionKey: false,
};

const ticketSchema = new Schema<TicketDoc>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
  },
  schemaOptions
);

// -------------------
// STATIC METHODS
ticketSchema.static('build', (attrs: TicketAttrs) => new Ticket(attrs));

// -------------------
// COMPILE MODEL
export const Ticket = model<TicketDoc, TicketModel>('User', ticketSchema);
