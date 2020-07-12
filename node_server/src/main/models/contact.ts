import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';

/**
 * Creates the contactSchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the contact schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created contactSchema
 */
function createContactSchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    dateCreated: { type: Date, default: Date.now },
  });
  if (addSchemas) {
    addSchemas.forEach(addSchema => {
      schema.add(addSchema);
    });
  }
  return schema;
}

/**
 * The mongoose schema for a contact in the database.
 */
const contactSchema = createContactSchema(crmUserDocument, note);

/**
 * The type representing a Contact document in the database.
 */
export interface ContactDoc extends CRMUserDocument, Note {
  name: string;
  email: string;
  phone: string;
  dateCreated: Date;
}

/**
 * An `Contact` class that represents a Contact in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type ContactModel = Model<ContactDoc>;

/**
 * Creates a `Contact` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {ContactModel} the `Contact` class
 */
export function createContactModel(db: typeof mongoose): ContactModel {
  return db.model('Contact', contactSchema);
}
