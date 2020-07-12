import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { ManufacturerDoc } from '../main/models/manufacturer';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Creates a new test manufacturer and asserts its values are correct with the given
 * userId as the `crmUser`.
 *
 * @param {string} userId the ID of the user to use as the `crmUser` for the
 * test manufacturer
 * @returns {ManufacturerDoc} the created testManufacturer
 */
export async function generateTestManufacturerWithId(
  userId: string
): Promise<ManufacturerDoc> {
  const manufacturerName = 'Some test manufacturer';

  const res = await Globals.requester.post(`/api/manufacturer`).send({
    name: manufacturerName,
    crmUser: userId,
  });

  // Make sure the response is good and the new manufacturer is valid.
  assert.typeOf(res.body, 'object');
  assert.equal(res.body.name, manufacturerName);
  assert.equal(res.body.crmUser, userId);

  const testManufacturer: ManufacturerDoc = res.body;
  return testManufacturer;
}

/**
 * Generates a test manufacturer with the global testUser as the `crmUser`.
 *
 * @returns {ManufacturerDoc} the created testManufacturer
 */
async function generateTestManufacturer(): Promise<ManufacturerDoc> {
  return generateTestManufacturerWithId(Globals.testUser._id);
}

describe('GET', () => {
  it('should return a manufacturer if it exists in the DB', async () => {
    const testManufacturer = await generateTestManufacturer();
    const res = await Globals.requester.get(
      `/api/manufacturer/${testManufacturer._id}`
    );
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    assert.equal(res.body.name, testManufacturer.name);
    assert.equal(res.body.crmUser, testManufacturer.crmUser);
  });
});

describe('DELETE', () => {
  it('should delete a manufacturer if it exists', async () => {
    const testManufacturer = await generateTestManufacturer();
    const deleteRes = await Globals.requester.delete(
      `/api/manufacturer/${testManufacturer._id}`
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    assert.equal(deleteRes.body.name, testManufacturer.name);
    assert.equal(deleteRes.body.crmUser, testManufacturer.crmUser);
    const getRes = await Globals.requester.get(
      `/api/manufacturer/${testManufacturer._id}`
    );
    assert.equal(getRes.status, 400);
  });
});
