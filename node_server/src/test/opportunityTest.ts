import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { OpportunityDoc } from '../main/models/opportunity';
import queries from './testQueries';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test opportunity and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test opportunity
 * @returns {OpportunityDoc} the created testOpportunity
 */
export async function generateTestOpportunityWithId(
  userId: string
): Promise<OpportunityDoc> {
  const res = await Globals.send(queries.createOne('opportunity', userId));

  // Make sure the response is good and the new opportunity is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedOpportunity = res.body.data.opportunityCreateOne.record;
  assert.equal(returnedOpportunity.crmUser, userId);

  const testOpportunity: OpportunityDoc = returnedOpportunity;
  return testOpportunity;
}

/**
 * Generates a test opportunity with the global testUser as the `crmUser`.
 *
 * @returns {OpportunityDoc} the created testOpportunity
 */
async function generateTestOpportunity(): Promise<OpportunityDoc> {
  return generateTestOpportunityWithId(Globals.testUser._id);
}

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * OpportunityDoc and the testOpportunity.
 *
 * @param {OpportunityDoc} returnedOpportunity the returned OpportunityDoc
 * @param {OpportunityDoc} testOpportunity the testOpportunity
 */
function assertOpportunityFields(
  returnedOpportunity: OpportunityDoc,
  testOpportunity: OpportunityDoc
): void {
  assert.equal(returnedOpportunity.name, testOpportunity.name);
  assert.equal(returnedOpportunity.crmUser, testOpportunity.crmUser);
  assert.equal(returnedOpportunity.account, testOpportunity.account);
  assert.equal(returnedOpportunity.oppNum, testOpportunity.oppNum);
}

describe('opportunityById', () => {
  it('should return a opportunity if it exists in the DB', async () => {
    const testOpportunity = await generateTestOpportunity();
    const res = await Globals.send(
      queries.getById('opportunity', testOpportunity._id)
    );
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedOpportunity: OpportunityDoc = res.body.data.opportunityById;
    assertOpportunityFields(returnedOpportunity, testOpportunity);
  });
});

describe('opportunityRemoveById', () => {
  it('should delete a opportunity if it exists', async () => {
    const testOpportunity = await generateTestOpportunity();
    const deleteRes = await Globals.send(
      queries.removeById('opportunity', testOpportunity._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedOpportunity =
      deleteRes.body.data.opportunityRemoveById.record;
    assertOpportunityFields(returnedOpportunity, testOpportunity);
    const getRes = await Globals.send(
      queries.getById('opportunity', testOpportunity._id)
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
