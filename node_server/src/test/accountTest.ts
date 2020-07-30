import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { AccountDoc } from '../main/models/account';
import queries from './testQueries';

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
export async function generateTestAccountWithId(
  userId: string
): Promise<AccountDoc> {
  const res = await Globals.send(queries.createOne('account', userId));

  // Make sure the response is good and the new account is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedAccount = res.body.data.accountCreateOne.record;
  assert.equal(returnedAccount.crmUser, userId);

  const testAccount: AccountDoc = returnedAccount;
  return testAccount;
}

/**
 * Generates a test account with the global testUser as the `crmUser`.
 *
 * @returns {AccountDoc} the created testAccount
 */
async function generateTestAccount(): Promise<AccountDoc> {
  return generateTestAccountWithId(Globals.testUser._id);
}

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * AccountDoc and the testAccount.
 *
 * @param {AccountDoc} returnedAccount the returned AccountDoc
 * @param {AccountDoc} testAccount the testAccount
 */
function assertAccountFields(
  returnedAccount: AccountDoc,
  testAccount: AccountDoc
): void {
  assert.equal(returnedAccount.name, testAccount.name);
  assert.equal(returnedAccount.crmUser, testAccount.crmUser);
  assert.deepEqual(
    returnedAccount.businessContacts,
    testAccount.businessContacts
  );
}

describe('accountById', () => {
  it('should return an account if it exists in the DB', async () => {
    const testAccount = await generateTestAccount();
    const res = await Globals.send(queries.getById('account', testAccount._id));
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedAccount: AccountDoc = res.body.data.accountById;
    assertAccountFields(returnedAccount, testAccount);
  });
});

describe('accountRemoveById', () => {
  it('should delete an account if it exists', async () => {
    const testAccount = await generateTestAccount();
    const deleteRes = await Globals.send(
      queries.removeById('account', testAccount._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedAccount = deleteRes.body.data.accountRemoveById.record;
    assertAccountFields(returnedAccount, testAccount);
    const getRes = await Globals.send(
      queries.getById('account', testAccount._id)
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
