import { Schema, SchemaOptions, model, Model, Document, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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
  version: number;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
    price: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  schemaOptions
);

// -------------------
// PLUGINS
ticketSchema.set('versionKey', 'version'); // rename '__v' field to 'version'
ticketSchema.plugin(updateIfCurrentPlugin); // ensure optimistic concurrency control (incrementing the document version) when saving

// -------------------
// STATIC METHODS
ticketSchema.static('build', (attrs: TicketAttrs) => new Ticket(attrs));

// -------------------
// COMPILE MODEL
export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
