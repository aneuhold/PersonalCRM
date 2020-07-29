import { GraphQLSchema } from 'graphql';
import mongoose from 'mongoose';
import { schemaComposer } from 'graphql-compose';
import { createUserTC, addUserFieldsToSchema } from '../models/user';

/**
 * Creates the GraphQL schema for the project from the mongoose models.
 *
 * @param {typeof mongoose} db the connected MongoDB database
 * @returns {GraphQLSchema} the created GraphQLSchema
 */
export default function createGraphQLSchema(
  db: typeof mongoose
): GraphQLSchema {
  const UserTC = createUserTC(db);

  addUserFieldsToSchema(UserTC, schemaComposer);

  return schemaComposer.buildSchema();
}
