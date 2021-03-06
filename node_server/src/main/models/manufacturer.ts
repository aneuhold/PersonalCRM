import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';
import { ContactDoc } from './contact';
import { ObjectTypeComposer, SchemaComposer } from 'graphql-compose';
import composeWithMongoose from 'graphql-compose-mongoose';
import { addFieldsToSchema } from '../graphQL/schema';

const ObjectId = mongoose.Types.ObjectId;

/**
 * Creates the manufacturerSchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the manufacturer schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created manufacturerSchema
 */
function createManufacturerSchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    name: {
      type: String,
      default: 'Un-named Manufacturer',
    },
    contacts: {
      type: [ObjectId],
      default: [],
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
 * The mongoose schema for a manufacturer in the database.
 */
const manufacturerSchema = createManufacturerSchema(crmUserDocument, note);

/**
 * The type representing a Manufacturer document in the database.
 */
export interface ManufacturerDoc extends CRMUserDocument, Note {
  name: string;
  contacts: Array<ContactDoc['_id']>;
  dateCreated: Date;
}

/**
 * An `Manufacturer` class that represents a Manufacturer in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type ManufacturerModel = Model<ManufacturerDoc>;

/**
 * Creates a `Manufacturer` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {ManufacturerModel} the `Manufacturer` class
 */
export function createManufacturerModel(
  db: typeof mongoose
): ManufacturerModel {
  return db.model('Manufacturer', manufacturerSchema);
}

/**
 * Creates a `Manufacturer` type composer.
 *
 * @param {typeof mongoose} db the connected MongoDB instance
 * @returns {ObjectTypeComposer<ManufacturerDoc, unknown>} the ManufacturerTC
 */
export function createManufacturerTC(
  db: typeof mongoose
): ObjectTypeComposer<ManufacturerDoc, unknown> {
  const Manufacturer = createManufacturerModel(db);
  return composeWithMongoose(Manufacturer);
}

/**
 * Adds fields to the provided schemaComposer for the Manufacturer model.
 *
 * @param {ObjectTypeComposer<ManufacturerDoc, unknown>} ManufacturerTC the
 * Manufacturer type composer to get resolvers for
 * @param {SchemaComposer<unknown>} schemaComposer the schemaComposer to add
 * fields to
 */
export function addManufacturerFieldsToSchema(
  ManufacturerTC: ObjectTypeComposer<ManufacturerDoc, unknown>,
  schemaComposer: SchemaComposer<unknown>
): void {
  addFieldsToSchema<ManufacturerDoc>(
    ManufacturerTC,
    schemaComposer,
    'manufacturer'
  );
}
