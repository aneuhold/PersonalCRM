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
 * Creates the opportunitySchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the opportunity schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created opportunitySchema
 */
function createOpportunitySchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    name: {
      type: String,
      default: 'Untitled Opportunity',
    },
    account: {
      type: ObjectId,
    },
    oppNum: String,
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
 * The mongoose schema for an Opportunity in the database.
 */
const opportunitySchema = createOpportunitySchema(crmUserDocument, note);

/**
 * The type representing an Opportunity document in the database.
 */
export interface OpportunityDoc extends CRMUserDocument, Note {
  name: string;
  account: Account['id'];
  oppNum: string;
  dateCreated: Date;
}

/**
 * An `Opportunity` class that represents an Opportunity in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type OpportunityModel = Model<OpportunityDoc>;

/**
 * Creates a `Opportunity` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {OpportunityModel} the `Opportunity` class
 */
export function createOpportunityModel(db: typeof mongoose): OpportunityModel {
  return db.model('Opportunity', opportunitySchema);
}

/**
 * Creates a `Opportunity` type composer.
 *
 * @param {typeof mongoose} db the connected MongoDB instance
 * @returns {ObjectTypeComposer<OpportunityDoc, unknown>} the OpportunityTC
 */
export function createOpportunityTC(
  db: typeof mongoose
): ObjectTypeComposer<OpportunityDoc, unknown> {
  const Opportunity = createOpportunityModel(db);
  return composeWithMongoose(Opportunity);
}

/**
 * Adds fields to the provided schemaComposer for the Opportunity model.
 *
 * @param {ObjectTypeComposer<OpportunityDoc, unknown>} OpportunityTC the
 * Opportunity type composer to get resolvers for
 * @param {SchemaComposer<unknown>} schemaComposer the schemaComposer to add
 * fields to
 */
export function addOpportunityFieldsToSchema(
  OpportunityTC: ObjectTypeComposer<OpportunityDoc, unknown>,
  schemaComposer: SchemaComposer<unknown>
): void {
  addFieldsToSchema<OpportunityDoc>(
    OpportunityTC,
    schemaComposer,
    'opportunity'
  );
}
