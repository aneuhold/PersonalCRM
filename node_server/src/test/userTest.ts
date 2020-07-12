import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { UserDoc } from '../main/models/user';
import { generateTestTaskWithId } from './taskTest';

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

  const res = await chai.request(Globals.app).post(`/api/user`).send({
    userName: userName,
  });

  // Makes sure the response is good and the new task is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.userName, userName);
  assert.deepEqual(res.body.openDocuments, []);

  const testUser: UserDoc = res.body;
  return testUser;
}

describe('GET', () => {
  it('should return a user if it exists in the DB', async () => {
    const testUser = await generateTestUser();
    const res = await chai
      .request(Globals.app)
      .get(`/api/user/${testUser._id}`);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body._id, testUser._id);
    assert.equal(res.body.userName, testUser.userName);
    assert.deepEqual(res.body.openDocuments, testUser.openDocuments);
  });
});

describe('DELETE', () => {
  it('should delete a user if it exists', async () => {
    const testUser = await generateTestUser();
    const deleteRes = await chai
      .request(Globals.app)
      .delete(`/api/user/${testUser._id}`);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body._id, testUser._id);
    assert.equal(deleteRes.body.userName, testUser.userName);
    assert.deepEqual(deleteRes.body.openDocuments, testUser.openDocuments);
    const getRes = await chai
      .request(Globals.app)
      .get(`/api/user/${testUser._id}`);
    assert.equal(getRes.status, 400);
  });
  it('should delete a user and the users documents if they were created', async () => {
    const testUser = await generateTestUser();
    const testTask = await generateTestTaskWithId(testUser._id);
    const deleteRes = await chai
      .request(Globals.app)
      .delete(`/api/user/${testUser._id}`);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body._id, testUser._id);
    assert.equal(deleteRes.body.userName, testUser.userName);
    assert.deepEqual(deleteRes.body.openDocuments, testUser.openDocuments);

    // Try to get the deleted user
    const getUserRes = await chai
      .request(Globals.app)
      .get(`/api/user/${testUser._id}`);
    assert.equal(getUserRes.status, 400);

    // Try to get the task of the user which should be deleted
    const getTaskRes = await chai
      .request(Globals.app)
      .get(`/api/task/${testTask._id}`);
    assert.equal(getTaskRes.status, 400);
  });
});
