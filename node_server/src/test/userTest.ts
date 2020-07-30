import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { UserDoc } from '../main/models/user';
import queries from './testQueries';
import { generateTestAccountWithId } from './accountTest';

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

  const res = await Globals.send({
    query: queries.userCreateOne,
    variables: {
      userName,
    },
  });

  // Makes sure the response is good and the new user is valid.
  assert.typeOf(res.body, 'object');
  const userRecord = res.body.data.userCreateOne.record;
  assert.equal(userRecord.userName, userName);
  assert.deepEqual(userRecord.openDocuments, []);

  const testUser: UserDoc = userRecord;
  return testUser;
}

/**
 * Deletes the user with the specified id and asserts that it was successful.
 *
 * @param {string} id the id of the user to delete
 */
export async function deleteUser(id: string): Promise<void> {
  const query = queries.userRemoveById;
  const res = await Globals.send({
    query,
    variables: {
      userId: id,
    },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.userRemoveById.record._id, id);
}

describe('userById', () => {
  it('should return a user if provided a valid ID', async () => {
    const testUser = await generateTestUser();
    const query = queries.userById;
    const sendObject = {
      query,
      variables: {
        userId: testUser._id,
      },
    };
    const res = await Globals.requester.post(`/graphql`).send(sendObject);
    assert.typeOf(res.body, 'object');
    const userRecord = res.body.data.userById;
    assert.equal(userRecord._id, testUser._id);
    assert.equal(userRecord.userName, testUser.userName);
    assert.deepEqual(userRecord.openDocuments, testUser.openDocuments);
    await deleteUser(testUser._id);
  });
});

describe('userRemoveById', () => {
  it('should delete a user if it exists', async () => {
    const testUser = await generateTestUser();
    const deleteRes = await Globals.send({
      query: queries.userRemoveById,
      variables: {
        userId: testUser._id,
      },
    });
    assert.typeOf(deleteRes.body, 'object');
    const deleteResUser = deleteRes.body.data.userRemoveById.record;
    assert.equal(deleteResUser._id, testUser._id);
    assert.equal(deleteResUser.userName, testUser.userName);
    assert.deepEqual(deleteResUser.openDocuments, testUser.openDocuments);
    const getRes = await Globals.send({
      query: queries.userById,
      variables: {
        userId: testUser._id,
      },
    });
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.userById, null);
  });
  it('should delete a user and the users documents if they were created', async () => {
    const testUser = await generateTestUser();
    /*
    const testTask = await generateTestTaskWithId(testUser._id);
    const testOpp = await generateTestOppWithId(testUser._id);
    */
    const testAccount = await generateTestAccountWithId(testUser._id);
    /*
    const testContact = await generateTestContactWithId(testUser._id);
    const testManufacturer = await generateTestManufacturerWithId(testUser._id);
    */

    // Delete the user
    const deleteRes = await Globals.send(
      queries.removeById('user', testUser._id)
    );
    assert.typeOf(deleteRes.body, 'object');
    const returnedUser = deleteRes.body.data.userRemoveById.record;
    assert.equal(returnedUser._id, testUser._id);
    assert.equal(returnedUser.userName, testUser.userName);
    assert.deepEqual(returnedUser.openDocuments, testUser.openDocuments);

    // Try to get the deleted account
    const getAccountRes = await Globals.send(
      queries.getById('account', testAccount._id)
    );
    assert.equal(getAccountRes.status, 200);
    assert.equal(getAccountRes.body.data.typeById, null);

    /*
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
    */

    // Try to get the deleted user
    const getUserRes = await Globals.requester.get(`/api/user/${testUser._id}`);
    assert.equal(getUserRes.status, 400);

    /*
    // Try to get the task of the user which should be deleted
    const getTaskRes = await Globals.requester.get(`/api/task/${testTask._id}`);
    assert.equal(getTaskRes.status, 400);
    */
  });
});
