import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';
import { ObjectTypeComposer, SchemaComposer } from 'graphql-compose';
import composeWithMongoose from 'graphql-compose-mongoose';
import { addFieldsToSchema } from '../graphQL/schema';

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
    name: {
      type: String,
      default: 'Untitled Account',
    },
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
export interface AccountDoc extends CRMUserDocument, Note {
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
export type AccountModel = Model<AccountDoc>;

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

/**
 * Creates an `Account` type composer.
 *
 * @param {typeof mongoose} db the connected MongoDB instance
 * @returns {ObjectTypeComposer<AccountDoc, unknown>} the AccountTC
 */
export function createAccountTC(
  db: typeof mongoose
): ObjectTypeComposer<AccountDoc, unknown> {
  const Account = createAccountModel(db);
  return composeWithMongoose(Account);
}

/**
 * Adds fields to the provided schemaComposer for the Account model.
 *
 * @param {ObjectTypeComposer<AccountDoc, unknown>} AccountTC the Account type
 * composer to get resolvers for
 * @param {SchemaComposer<unknown>} schemaComposer the schemaComposer to add
 * fields to
 */
export function addAccountFieldsToSchema(
  AccountTC: ObjectTypeComposer<AccountDoc, unknown>,
  schemaComposer: SchemaComposer<unknown>
): void {
  addFieldsToSchema<AccountDoc>(AccountTC, schemaComposer, 'account');
}
