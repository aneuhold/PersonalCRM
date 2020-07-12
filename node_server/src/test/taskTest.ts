import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { TaskDoc } from '../main/models/task';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test task and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test task
 * @returns {TaskDoc} the created testTask
 */
export async function generateTestTaskWithId(userId: string): Promise<TaskDoc> {
  const taskTitle = 'Some test task';

  const res = await Globals.requester.post(`/api/task`).send({
    title: taskTitle,
    crmUser: userId,
  });

  // Makes sure the response is good and the new task is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.title, taskTitle);
  assert.equal(res.body.crmUser, userId);

  const testTask: TaskDoc = res.body;
  return testTask;
}

/**
 * Generates a test task with the global testUser as the `crmUser`.
 *
 * @returns {TaskDoc} the created testTask
 */
async function generateTestTask(): Promise<TaskDoc> {
  return generateTestTaskWithId(Globals.testUser._id);
}

describe('GET', () => {
  it('should return a task if it exists in the DB', async () => {
    const testTask = await generateTestTask();
    const res = await Globals.requester.get(`/api/task/${testTask._id}`);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body._id, testTask._id);
    assert.equal(res.body.title, testTask.title);
    assert.equal(res.body.crmUser, testTask.crmUser);
  });
});

describe('DELETE', () => {
  it('should delete a task if it exists', async () => {
    const testTask = await generateTestTask();
    const deleteRes = await Globals.requester.delete(
      `/api/task/${testTask._id}`
    );
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body._id, testTask._id);
    assert.equal(deleteRes.body.title, testTask.title);
    assert.equal(deleteRes.body.crmUser, testTask.crmUser);
    const getRes = await Globals.requester.get(`/api/task/${testTask._id}`);
    assert.equal(getRes.status, 400);
  });
});
