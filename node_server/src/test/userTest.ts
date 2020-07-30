import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { UserDoc } from '../main/models/user';
import queries from './testQueries';
import { generateTestAccountWithId } from './accountTest';
import { generateTestContactWithId } from './contactTest';
import { generateTestTaskWithId } from './taskTest';
import { generateTestManufacturerWithId } from './manufacturerTest';
import { generateTestOpportunityWithId } from './opportunityTest';

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
    const testTask = await generateTestTaskWithId(testUser._id);
    const testOpp = await generateTestOpportunityWithId(testUser._id);
    const testAccount = await generateTestAccountWithId(testUser._id);
    const testContact = await generateTestContactWithId(testUser._id);
    const testManufacturer = await generateTestManufacturerWithId(testUser._id);

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
    assert.equal(getAccountRes.body.data.accountById, null);

    // Try to get the deleted contact
    const getContactRes = await Globals.send(
      queries.getById('contact', testContact._id)
    );
    assert.equal(getContactRes.status, 200);
    assert.equal(getContactRes.body.data.contactById, null);

    // Try to get the deleted opp
    const getOppRes = await Globals.send(
      queries.getById('opportunity', testOpp._id)
    );
    assert.equal(getOppRes.status, 200);
    assert.equal(getOppRes.body.data.opportunityById, null);

    // Try to get the deleted task
    const getTaskRes = await Globals.send(
      queries.getById('task', testTask._id)
    );
    assert.equal(getTaskRes.status, 200);
    assert.equal(getTaskRes.body.data.taskById, null);

    // Try to get the deleted manufacturer
    const getManufacturerRes = await Globals.send(
      queries.getById('manufacturer', testManufacturer._id)
    );
    assert.equal(getManufacturerRes.status, 200);
    assert.equal(getManufacturerRes.body.data.manufacturerById, null);

    // Try to get the deleted user
    const getUserRes = await Globals.send(
      queries.getById('user', testUser._id)
    );
    assert.equal(getUserRes.status, 200);
    assert.equal(getUserRes.body.data.contactById, null);
  });
});
