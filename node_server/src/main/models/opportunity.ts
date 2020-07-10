import mongoose, { Model, Schema, Document } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

/**
 * The mongoose schema for an Opportunity in the database.
 */
const opportunitySchema = new Schema({
  account: ObjectId,
  notes: String,
  oppNum: String,
  dateCreated: { type: Date, default: Date.now },
});

/**
 * The type representing an Opportunity document in the database.
 */
export interface OpportunityDoc extends Document {
  account: typeof ObjectId;
  notes: string;
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
