import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { AccountDoc } from '../main/models/account';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test account and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test account
 * @returns {AccountDoc} the created testAccount
 */
export async function generateAccountWithId(
  userId: string
): Promise<AccountDoc> {
  const accountName = 'Some test account';

  const res = await chai.request(Globals.app).post(`/api/account`).send({
    name: accountName,
    crmUser: userId,
  });

  // Make sure the response is good and the new account is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.name, accountName);
  assert.equal(res.body.crmUser, userId);

  const testAccount: AccountDoc = res.body;
  return testAccount;
}

/**
 * Generates a test account with the global testUser as the `crmUser`.
 *
 * @returns {AccountDoc} the created testAccount
 */
async function generateTestAccount(): Promise<AccountDoc> {
  return generateAccountWithId(Globals.testUser._id);
}

describe('GET', () => {
  it('should return an account if it exists in the DB', async () => {
    const testAccount = await generateTestAccount();
    const res = await chai
      .request(Globals.app)
      .get(`/api/account/${testAccount._id}`);
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body.name, testAccount.name);
    assert.equal(res.body.crmUser, testAccount.crmUser);
  });
});

describe('DELETE', () => {
  it('should delete an account if it exists', async () => {
    const testAccount = await generateTestAccount();
    const deleteRes = await chai
      .request(Globals.app)
      .delete(`/api/account/${testAccount._id}`);
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body.name, testAccount.name);
    assert.equal(deleteRes.body.crmUser, testAccount.crmUser);
    const getRes = await chai
      .request(Globals.app)
      .get(`/api/account/${testAccount._id}`);
    assert.equal(getRes.status, 400);
  });
});
