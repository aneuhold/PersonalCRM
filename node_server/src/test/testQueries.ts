import { crmModelName } from '../main/models/crmModels';

export type GraphQLQueryPayload = {
  query: string;
  variables?: {
    [index: string]: unknown;
  };
};

const returnFields: {
  [index: string]: string;
} = {
  account: `_id
  name
  region
  businessContacts
  zonesContacts
  techDetails
  crmLink
  crmUser
  notes`,
  user: `_id
  userName
  dateCreated
  openDocuments {
    id
    docType
  }`,
  contact: `_id
  name
  email
  phone
  dateCreated
  crmUser
  notes`,
};

/**
 * Holds re-usable queries for use with the `/graphql` endpoint. Each query has
 * a short description as far as what it needs and returns.
 */
const queries = {
  /**
   * Requires a `userId` variable to be defined.
   *
   * Returned value would be in `res.body.data.userById`.
   */
  userById: `query ($userId: MongoID!) {
    userById(_id: $userId) {
      _id
      userName
      dateCreated
      openDocuments {
        id
        docType
      }
    }
  }`,
  /**
   * Requires a `userId` variable to be defined.
   *
   * Returned value would be in `res.body.data.userRemoveById.record`.
   */
  userRemoveById: `mutation($userId:MongoID) {
    userRemoveById(filter: {
      _id: $userId
    }) {
      record {
        _id
        userName
        dateCreated
        openDocuments {
          id
          docType
        }
      }
    }
  }`,
  /**
   * Requires a `userName` variable to be defined.
   *
   * Returned value would be in `res.body.data.userCreateOne.record`.
   */
  userCreateOne: `mutation ($userName: String!) {
    userCreateOne(record: {userName: $userName}) {
      record {
        _id
        userName
        openDocuments {
          docType
          id
        }
      }
    }
  }`,
  /**
   * Requires a `userFilter` and `updatedUser` variable to be defined.
   *
   * Returned value would be in `res.body.data.userUpdateOne.record`.
   */
  userUpdateOne: `mutation ($userFilter: FilterUpdateOneUserInput!, $updatedUser: UpdateOneUserInput!) {
    userUpdateOne(filter: $userFilter, record: $updatedUser) {
      record {
        _id
        userName
        openDocuments {
          id
          docType
        }
        dateCreated
      }
    }
  }`,
  /**
   * Requires a `updatedUser` variable to be defined which is where the `_id`
   * is pulled from.
   *
   * Returned value would be in `res.body.data.userUpdateById.record`.
   */
  userUpdateById: `mutation ($updatedUser: UpdateByIdUserInput!) {
    userUpdateById(record: $updatedUser) {
      record {
        _id
        userName
        openDocuments {
          id
          docType
        }
        dateCreated
      }
    }
  }`,
  /**
   * Creates a query payload for the various blankById fields of the GraphQL
   * server.
   *
   * Returned value would be in `res.body.data.typeById`.
   *
   * @param {crmModelName} type the name of the model to request
   * @param {string} docId the ID of the document to get
   * @returns {GraphQLQueryPayload} the payload to send to the GraphQL endpoint
   */
  getById: (type: crmModelName, docId: string): GraphQLQueryPayload => {
    return {
      query: `query ($docId: MongoID!) {
        ${type}ById(_id: $docId) {
          ${returnFields[type]}
        }
      }`,
      variables: {
        docId,
      },
    };
  },
  /**
   * Creates a query payload for the typeCreateOne field of the GraphQL
   * server. This is not valid for the `user` model.
   *
   * Returned value would be in `res.body.data.typeCreateOne.record`.
   *
   * @param {crmModelName} type the type of the model to createOne for
   * @param {string} userId the userId to assign the model to
   * @returns {GraphQLQueryPayload} the payload to send to the GraphQL endpoint
   */
  createOne: (type: crmModelName, userId: string): GraphQLQueryPayload => {
    const capitalizedType = type.slice(0, 1).toUpperCase() + type.slice(1);
    const doc = {
      crmUser: userId,
    };
    return {
      query: `mutation ($doc: CreateOne${capitalizedType}Input!) {
        ${type}CreateOne(record: $doc) {
          record {
            ${returnFields[type]}
          }
        }
      }`,
      variables: {
        doc,
      },
    };
  },
  /**
   * Creates a query payload for the typeRemoveById field of the GraphQL
   * server.
   *
   * Returned value would be in `res.body.data.typeRemoveById.record`.
   *
   * @param {crmModelName} type the type of the model to remove
   * @param {string} docId the ID of the document to remove
   * @returns {GraphQLQueryPayload} the payload to send to the GraphQL endpoint
   */
  removeById: (type: crmModelName, docId: string): GraphQLQueryPayload => {
    return {
      query: `mutation ($docId: MongoID!) {
        ${type}RemoveById(filter: {_id: $docId}) {
          record {
            ${returnFields[type]}
          }
        }
      }`,
      variables: {
        docId,
      },
    };
  },
  /**
   * Creates a query payload for the typeRemoveMany field of the GraphQL
   * server.
   *
   * Returned value would be in `res.body.data.typeRemoveMany.numAffected`.
   *
   * @param {crmModelName} type the type of the model to removeMany for
   * @param {unknown} filter the filter object to use
   * @returns {GraphQLQueryPayload} the payload to send to the GraphQL endpoint
   */
  removeMany: (type: crmModelName, filter: unknown): GraphQLQueryPayload => {
    return {
      query: `mutation ($filter: FilterRemoveManyAccountInput!) {
        accountRemoveMany(filter: $filter) {
          numAffected
        }
      }`,
      variables: {
        filter,
      },
    };
  },
};

export default queries;
