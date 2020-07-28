import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';

const ObjectId = mongoose.Types.ObjectId;

/**
 * Creates the accountTechSchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the account schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created accountTechSchema
 */
function createAccountTechSchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    account: {
      type: ObjectId,
      required: true,
    },
    manufacturer: {
      type: ObjectId,
    },
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
const accountTechSchema = createAccountTechSchema(crmUserDocument, note);

/**
 * The type representing an Account document in the database.
 */
export interface AccountTechDoc extends CRMUserDocument, Note {
  account: string;
  manufacturer: string;
  dateCreated: Date;
}

/**
 * An `Account` class that represents an Account in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type AccountTechModel = Model<AccountTechDoc>;

/**
 * Creates an `Account` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {AccountTechModel} the `Account` class
 */
export function createAccountTechModel(db: typeof mongoose): AccountTechModel {
  return db.model('AccountTech', accountTechSchema);
}
