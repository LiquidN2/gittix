import { Schema, SchemaOptions, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

// An interface the describes the properties required to create a User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties that a User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEmail(email: string): UserDoc | null;
}

// ------------------
// SCHEMA
const schemaOptions: SchemaOptions = {
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    // transform the returned JSON
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
    versionKey: false,
  },
};

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  schemaOptions
);

// -------------------
// STATIC METHODS
userSchema.static('build', (attrs: UserAttrs) => new User(attrs));

userSchema.static(
  'findByEmail',
  async (email: string) => await User.findOne({ email })
);

// -------------------
// HOOKS
// Hash password before saving the document
userSchema.pre('save', async function (next) {
  const user = this;

  // Skip if password is not modified
  if (!user.isModified('password')) return next();

  const hashedPassword = await Password.toHash(user.password);
  user.set('password', hashedPassword);

  next();
});

// -------------------
// COMPILE MODEL
export const User = model<UserDoc, UserModel>('User', userSchema);
