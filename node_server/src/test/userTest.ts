import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { UserDoc } from '../main/models/user';
import { generateTestTaskWithId } from './taskTest';
import { generateTestOppWithId } from './opportunityTest';
import { generateTestAccountWithId } from './accountTest';
import { generateTestContactWithId } from './contactTest';
import { generateTestManufacturerWithId } from './manufacturerTest';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test user and asserts its values are correct.
 *
 * @returns {UserDoc} the created testUser
 */
export async function generateTestUser(): Promise<UserDoc> {
  const userName = 'someTestUser';

  const query = `mutation($userName:String!) {
    userCreateOne(record: {userName: $userName}) {
      record {
        _id
        userName
        dateCreated
        openDocuments {
          docType
          id
        }
      }
    }
  }`;

  const res = await Globals.requester.post(`/graphql`).send({
    query,
    variables: {
      userName,
    },
  });

  // Makes sure the response is good and the new user is valid.
  assert.typeOf(res.body, 'object');
  const userRecord = res.body.data.userCreateOne.record;
  assert.equal(userRecord.userName, userName);
  assert.deepEqual(userRecord.openDocuments, []);

  const testUser: UserDoc = res.body;
  return testUser;
}

/**
 * Deletes the user with the specified id and asserts that it was successful.
 *
 * @param {string} id the id of the user to delete
 */
export async function deleteUser(id: string): Promise<void> {
  const query = `mutation($userId:MongoID) {
    userRemoveById(filter: {
      _id: $userId
    }) {
      record {
        _id
      }
    }
  }`;
  const res = await Globals.requester.post(`/graphql`).send({
    query,
    variables: {
      userId: id,
    },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.userRemoveById.record._id, id);
}

describe('GET', () => {
  it('should return a user if it exists in the DB', async () => {
    const testUser = await generateTestUser();
    const res = await Globals.requester.get(`/api/user/${testUser._id}`);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body._id, testUser._id);
    assert.equal(res.body.userName, testUser.userName);
    assert.deepEqual(res.body.openDocuments, testUser.openDocuments);
    await deleteUser(testUser._id);
  });
});

describe('DELETE', () => {
  it('should delete a user if it exists', async () => {
    const testUser = await generateTestUser();
    const deleteRes = await Globals.requester.delete(
      `/api/user/${testUser._id}`
    );
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body._id, testUser._id);
    assert.equal(deleteRes.body.userName, testUser.userName);
    assert.deepEqual(deleteRes.body.openDocuments, testUser.openDocuments);
    const getRes = await Globals.requester.get(`/api/user/${testUser._id}`);
    assert.equal(getRes.status, 400);
  });
  it('should delete a user and the users documents if they were created', async () => {
    const testUser = await generateTestUser();
    const testTask = await generateTestTaskWithId(testUser._id);
    const testOpp = await generateTestOppWithId(testUser._id);
    const testAccount = await generateTestAccountWithId(testUser._id);
    const testContact = await generateTestContactWithId(testUser._id);
    const testManufacturer = await generateTestManufacturerWithId(testUser._id);
    const deleteRes = await Globals.requester.delete(
      `/api/user/${testUser._id}`
    );
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body._id, testUser._id);
    assert.equal(deleteRes.body.userName, testUser.userName);
    assert.deepEqual(deleteRes.body.openDocuments, testUser.openDocuments);

    // Try to get the deleted account
    const getAccountRes = await Globals.requester.get(
      `/api/account/${testAccount._id}`
    );
    assert.equal(getAccountRes.status, 400);

    // Try to get the deleted contact
    const getContactRes = await Globals.requester.get(
      `/api/contact/${testContact._id}`
    );
    assert.equal(getContactRes.status, 400);

    // Try to get the deleted account
    const getManufacturerRes = await Globals.requester.get(
      `/api/manufacturer/${testManufacturer._id}`
    );
    assert.equal(getManufacturerRes.status, 400);

    // Try to get the deleted opp
    const getOppRes = await Globals.requester.get(
      `/api/opportunity/${testOpp._id}`
    );
    assert.equal(getOppRes.status, 400);

    // Try to get the deleted user
    const getUserRes = await Globals.requester.get(`/api/user/${testUser._id}`);
    assert.equal(getUserRes.status, 400);

    // Try to get the task of the user which should be deleted
    const getTaskRes = await Globals.requester.get(`/api/task/${testTask._id}`);
    assert.equal(getTaskRes.status, 400);
  });
});
