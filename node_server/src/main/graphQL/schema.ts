import { GraphQLSchema } from 'graphql';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { schemaComposer } from 'graphql-compose';
import { createUserModel } from '../models/user';

/**
 * Creates the GraphQL schema for the project from the mongoose models.
 *
 * @param {typeof mongoose} db the connected MongoDB database
 * @returns {GraphQLSchema} the created GraphQLSchema
 */
export default function createGraphQLSchema(
  db: typeof mongoose
): GraphQLSchema {
  const User = createUserModel(db);
  const UserTC = composeWithMongoose(User);

  schemaComposer.Query.addFields({
    userMany: UserTC.getResolver('findMany'),
  });

  schemaComposer.Mutation.addFields({
    userCreateOne: UserTC.getResolver('createOne'),
  });

  return schemaComposer.buildSchema();
}
