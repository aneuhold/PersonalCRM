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
};

export default queries;
