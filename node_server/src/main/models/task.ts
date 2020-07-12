import mongoose, { Model, Schema, SchemaDefinition } from 'mongoose';
import CRMUserDocument, {
  crmUserDocument,
} from '../interfaces/CRMUserDocument';
import Note, { note } from '../interfaces/Note';

/**
 * Creates the taskSchema with the provided interfaces if desired.
 *
 * @param {...SchemaDefinition[]} addSchemas different additional schemas that
 * should be added to the task schema. This is like adding interfaces.
 * The things added here are just objects.
 * @returns {Schema} the created taskSchema
 */
function createTaskSchema(...addSchemas: SchemaDefinition[]): Schema {
  const schema = new Schema({
    title: {
      type: String,
      required: true,
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
 * The mongoose schema for a Task in the database.
 */
const taskSchema = createTaskSchema(crmUserDocument, note);

/**
 * The type representing an Opportunity document in the database.
 */
export interface TaskDoc extends CRMUserDocument, Note {
  title: string;
  dateCreated: Date;
}

/**
 * A `Task` class that represents a task in the MongoDB. This
 * extends the mongoose `Model` type.
 */
export type TaskModel = Model<TaskDoc>;

/**
 * Creates a `Task` model from a given connected mongoose MongoDB
 * database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {TaskModel} the `Task` class
 */
export function createTaskModel(db: typeof mongoose): TaskModel {
  return db.model('Task', taskSchema);
}
