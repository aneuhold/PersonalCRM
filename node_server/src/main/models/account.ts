import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';

const ObjectId = mongoose.Types.ObjectId;

/**
 * Creates the accountSchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the account schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created accountSchema
 */
function createAccountSchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    name: String,
    region: String,
    businessContacts: {
      type: [ObjectId],
      default: [],
    },
    zonesContacts: {
      type: [ObjectId],
      default: [],
    },
    techDetails: {
      type: [ObjectId],
      default: [],
    },
    crmLink: String,
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
 * The mongoose schema for an Account in the database.
 */
const accountSchema = createAccountSchema(crmUserDocument, note);

/**
 * The type representing an Account document in the database.
 */
export interface AcccountDoc extends CRMUserDocument, Note {
  name: string;
  region: string;
  businessContacts: Array<typeof ObjectId>;
  zonesContacts: Array<typeof ObjectId>;
  techDetails: Array<typeof ObjectId>;
  crmLink: string;
  dateCreated: Date;
}

/**
 * An `Account` class that represents an Account in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type AccountModel = Model<AcccountDoc>;

/**
 * Creates an `Account` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {AccountModel} the `Account` class
 */
export function createAccountModel(db: typeof mongoose): AccountModel {
  return db.model('Account', accountSchema);
}
