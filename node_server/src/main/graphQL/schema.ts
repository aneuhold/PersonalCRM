import { GraphQLSchema } from 'graphql';
import mongoose from 'mongoose';
import {
  schemaComposer,
  SchemaComposer,
  ObjectTypeComposer,
  Resolver,
} from 'graphql-compose';
import { createUserTC, addUserFieldsToSchema } from '../models/user';
import { ArgsMap } from 'graphql-compose/lib/ObjectTypeComposer';
import { createAccountTC, addAccountFieldsToSchema } from '../models/account';
import {
  createAccountTechTC,
  addAccountTechFieldsToSchema,
} from '../models/accountTech';
import {
  createManufacturerTC,
  addManufacturerFieldsToSchema,
} from '../models/manufacturer';
import {
  createOpportunityTC,
  addOpportunityFieldsToSchema,
} from '../models/opportunity';
import { createTaskTC, addTaskFieldsToSchema } from '../models/task';
import { createContactTC, addContactFieldsToSchema } from '../models/contact';

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
  const AccountTC = createAccountTC(db);
  const AccountTechTC = createAccountTechTC(db);
  const ContactTC = createContactTC(db);
  const ManufacturerTC = createManufacturerTC(db);
  const OpportunityTC = createOpportunityTC(db);
  const TaskTC = createTaskTC(db);

  addUserFieldsToSchema(UserTC, schemaComposer);
  addAccountFieldsToSchema(AccountTC, schemaComposer);
  addAccountTechFieldsToSchema(AccountTechTC, schemaComposer);
  addContactFieldsToSchema(ContactTC, schemaComposer);
  addManufacturerFieldsToSchema(ManufacturerTC, schemaComposer);
  addOpportunityFieldsToSchema(OpportunityTC, schemaComposer);
  addTaskFieldsToSchema(TaskTC, schemaComposer);

  return schemaComposer.buildSchema();
}

type FieldsObject = {
  [fieldName: string]: Resolver<unknown, unknown, ArgsMap, unknown>;
};

/**
 * Adds fields to the provided schemaComposer for the given model.
 *
 * @param {ObjectTypeComposer<T, unknown>} ModelTC the model type
 * composer to get resolvers for. T is the document type, for example
 * `UserDoc`
 * @param {SchemaComposer<unknown>} schemaComposer the schemaComposer to add
 * fields to
 * @param {string} typeName the lowercase name of the model to add fields for.
 * For example `user`.
 */
export function addFieldsToSchema<T>(
  ModelTC: ObjectTypeComposer<T, unknown>,
  schemaComposer: SchemaComposer<unknown>,
  typeName: string
): void {
  const queryFields: FieldsObject = {};
  queryFields[`${typeName}Many`] = ModelTC.getResolver('findMany');
  queryFields[`${typeName}ById`] = ModelTC.getResolver('findById');
  schemaComposer.Query.addFields(queryFields);

  const mutationFields: FieldsObject = {};
  mutationFields[`${typeName}CreateOne`] = ModelTC.getResolver('createOne');
  mutationFields[`${typeName}RemoveById`] = ModelTC.getResolver('removeOne');
  mutationFields[`${typeName}RemoveMany`] = ModelTC.getResolver('removeMany');
  mutationFields[`${typeName}UpdateOne`] = ModelTC.getResolver('updateOne');
  mutationFields[`${typeName}UpdateById`] = ModelTC.getResolver('updateById');
  schemaComposer.Mutation.addFields(mutationFields);
}
