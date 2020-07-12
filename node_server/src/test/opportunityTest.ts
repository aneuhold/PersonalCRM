import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { OpportunityDoc } from '../main/models/opportunity';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test opp and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test opp
 * @returns {OpportunityDoc} the created testOpp
 */
export async function generateTestOppWithId(
  userId: string
): Promise<OpportunityDoc> {
  const oppName = 'Some test opp';

  const res = await Globals.requester.post(`/api/opportunity`).send({
    name: oppName,
    crmUser: userId,
  });

  // Make sure the response is good and the new opp is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.name, oppName);
  assert.equal(res.body.crmUser, userId);

  const testOpp: OpportunityDoc = res.body;
  return testOpp;
}

/**
 * Generates a test opp with the global testUser as the `crmUser`.
 *
 * @returns {OpportunityDoc} the created testOpp
 */
async function generateTestOpp(): Promise<OpportunityDoc> {
  return generateTestOppWithId(Globals.testUser._id);
}

describe('GET', () => {
  it('should return an opp if it exists in the DB', async () => {
    const testOpp = await generateTestOpp();
    const res = await Globals.requester.get(`/api/opportunity/${testOpp._id}`);
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body.name, testOpp.name);
    assert.equal(res.body.crmUser, testOpp.crmUser);
  });
});

describe('DELETE', () => {
  it('should delete an opp if it exists', async () => {
    const testOpp = await generateTestOpp();
    const deleteRes = await Globals.requester.delete(
      `/api/opportunity/${testOpp._id}`
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body.name, testOpp.name);
    assert.equal(deleteRes.body.crmUser, testOpp.crmUser);
    const getRes = await Globals.requester.get(
      `/api/opportunity/${testOpp._id}`
    );
    assert.equal(getRes.status, 400);
  });
});
