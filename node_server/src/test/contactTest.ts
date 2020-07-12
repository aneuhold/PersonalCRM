import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { ContactDoc } from '../main/models/contact';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test contact and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test contact
 * @returns {ContactDoc} the created testContact
 */
export async function generateTestContactWithId(
  userId: string
): Promise<ContactDoc> {
  const contactName = 'Some test contact';

  const res = await Globals.requester.post(`/api/contact`).send({
    name: contactName,
    crmUser: userId,
  });

  // Make sure the response is good and the new contact is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.name, contactName);
  assert.equal(res.body.crmUser, userId);

  const testContact: ContactDoc = res.body;
  return testContact;
}

/**
 * Generates a test contact with the global testUser as the `crmUser`.
 *
 * @returns {ContactDoc} the created testContact
 */
async function generateTestContact(): Promise<ContactDoc> {
  return generateTestContactWithId(Globals.testUser._id);
}

describe('GET', () => {
  it('should return a contact if it exists in the DB', async () => {
    const testContact = await generateTestContact();
    const res = await Globals.requester.get(`/api/contact/${testContact._id}`);
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body.name, testContact.name);
    assert.equal(res.body.crmUser, testContact.crmUser);
  });
});

describe('DELETE', () => {
  it('should delete a contact if it exists', async () => {
    const testContact = await generateTestContact();
    const deleteRes = await Globals.requester.delete(
      `/api/contact/${testContact._id}`
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body.name, testContact.name);
    assert.equal(deleteRes.body.crmUser, testContact.crmUser);
    const getRes = await Globals.requester.get(
      `/api/contact/${testContact._id}`
    );
    assert.equal(getRes.status, 400);
  });
});
