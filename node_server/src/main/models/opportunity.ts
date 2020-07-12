import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';

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
    account: ObjectId,
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
  account: typeof ObjectId;
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
