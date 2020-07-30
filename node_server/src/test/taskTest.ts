import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { TaskDoc } from '../main/models/task';
import queries from './testQueries';

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
  const res = await Globals.send(queries.createOne('task', userId));

  // Make sure the response is good and the new task is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedTask = res.body.data.taskCreateOne.record;
  assert.equal(returnedTask.crmUser, userId);

  const testTask: TaskDoc = returnedTask;
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

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * TaskDoc and the testTask.
 *
 * @param {TaskDoc} returnedTask the returned TaskDoc
 * @param {TaskDoc} testTask the testTask
 */
function assertTaskFields(returnedTask: TaskDoc, testTask: TaskDoc): void {
  assert.equal(returnedTask.title, testTask.title);
  assert.equal(returnedTask.crmUser, testTask.crmUser);
  assert.equal(returnedTask.notes, testTask.notes);
}

describe('taskById', () => {
  it('should return a task if it exists in the DB', async () => {
    const testTask = await generateTestTask();
    const res = await Globals.send(queries.getById('task', testTask._id));
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedTask: TaskDoc = res.body.data.taskById;
    assertTaskFields(returnedTask, testTask);
  });
});

describe('taskRemoveById', () => {
  it('should delete a task if it exists', async () => {
    const testTask = await generateTestTask();
    const deleteRes = await Globals.send(
      queries.removeById('task', testTask._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedTask = deleteRes.body.data.taskRemoveById.record;
    assertTaskFields(returnedTask, testTask);
    const getRes = await Globals.send(queries.getById('task', testTask._id));
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
