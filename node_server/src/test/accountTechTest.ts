import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { AccountTechDoc } from '../main/models/accountTech';
import queries from './testQueries';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test accountTech and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test accountTech
 * @returns {AccountTechDoc} the created testAccountTech
 */
export async function generateTestAccountTechWithId(
  userId: string
): Promise<AccountTechDoc> {
  const res = await Globals.send(queries.createOne('accountTech', userId));

  // Make sure the response is good and the new accountTech is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedAccountTech = res.body.data.accountTechCreateOne.record;
  assert.equal(returnedAccountTech.crmUser, userId);

  const testAccountTech: AccountTechDoc = returnedAccountTech;
  return testAccountTech;
}

/**
 * Generates a test accountTech with the global testUser as the `crmUser`.
 *
 * @returns {AccountTechDoc} the created testAccountTech
 */
async function generateTestAccountTech(): Promise<AccountTechDoc> {
  return generateTestAccountTechWithId(Globals.testUser._id);
}

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * AccountTechDoc and the testAccountTech.
 *
 * @param {AccountTechDoc} returnedAccountTech the returned AccountTechDoc
 * @param {AccountTechDoc} testAccountTech the testAccountTech
 */
function assertAccountTechFields(
  returnedAccountTech: AccountTechDoc,
  testAccountTech: AccountTechDoc
): void {
  assert.equal(returnedAccountTech.account, testAccountTech.account);
  assert.equal(returnedAccountTech.crmUser, testAccountTech.crmUser);
  assert.equal(returnedAccountTech.manufacturer, testAccountTech.manufacturer);
  assert.equal(returnedAccountTech.notes, testAccountTech.notes);
}

describe('accountTechById', () => {
  it('should return a accountTech if it exists in the DB', async () => {
    const testAccountTech = await generateTestAccountTech();
    const res = await Globals.send(
      queries.getById('accountTech', testAccountTech._id)
    );
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedAccountTech: AccountTechDoc = res.body.data.accountTechById;
    assertAccountTechFields(returnedAccountTech, testAccountTech);
  });
});

describe('accountTechRemoveById', () => {
  it('should delete a accountTech if it exists', async () => {
    const testAccountTech = await generateTestAccountTech();
    const deleteRes = await Globals.send(
      queries.removeById('accountTech', testAccountTech._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedAccountTech =
      deleteRes.body.data.accountTechRemoveById.record;
    assertAccountTechFields(returnedAccountTech, testAccountTech);
    const getRes = await Globals.send(
      queries.getById('accountTech', testAccountTech._id)
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
