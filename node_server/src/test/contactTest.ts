import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { ContactDoc } from '../main/models/contact';
import queries from './testQueries';

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
  const res = await Globals.send(queries.createOne('contact', userId));

  // Make sure the response is good and the new contact is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedContact = res.body.data.contactCreateOne.record;
  assert.equal(returnedContact.crmUser, userId);

  const testContact: ContactDoc = returnedContact;
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

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * ContactDoc and the testContact.
 *
 * @param {ContactDoc} returnedContact the returned ContactDoc
 * @param {ContactDoc} testContact the testContact
 */
function assertContactFields(
  returnedContact: ContactDoc,
  testContact: ContactDoc
): void {
  assert.equal(returnedContact.name, testContact.name);
  assert.equal(returnedContact.crmUser, testContact.crmUser);
  assert.equal(returnedContact.email, testContact.email);
  assert.equal(returnedContact.phone, testContact.phone);
}

describe('contactById', () => {
  it('should return a contact if it exists in the DB', async () => {
    const testContact = await generateTestContact();
    const res = await Globals.send(queries.getById('contact', testContact._id));
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedContact: ContactDoc = res.body.data.contactById;
    assertContactFields(returnedContact, testContact);
  });
});

describe('contactRemoveById', () => {
  it('should delete a contact if it exists', async () => {
    const testContact = await generateTestContact();
    const deleteRes = await Globals.send(
      queries.removeById('contact', testContact._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedContact = deleteRes.body.data.contactRemoveById.record;
    assertContactFields(returnedContact, testContact);
    const getRes = await Globals.send(
      queries.getById('contact', testContact._id)
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
