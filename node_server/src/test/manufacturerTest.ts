import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';
import { ManufacturerDoc } from '../main/models/manufacturer';
import queries from './testQueries';

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
  const res = await Globals.send(queries.createOne('manufacturer', userId));

  // Make sure the response is good and the new manufacturer is valid.
  assert.equal(res.status, 200);
  assert.typeOf(res.body, 'object');
  const returnedManufacturer = res.body.data.manufacturerCreateOne.record;
  assert.equal(returnedManufacturer.crmUser, userId);

  const testManufacturer: ManufacturerDoc = returnedManufacturer;
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

/**
 * Provides a uniform way to test all relevant fields are equal on a returned
 * ManufacturerDoc and the testManufacturer.
 *
 * @param {ManufacturerDoc} returnedManufacturer the returned ManufacturerDoc
 * @param {ManufacturerDoc} testManufacturer the testManufacturer
 */
function assertManufacturerFields(
  returnedManufacturer: ManufacturerDoc,
  testManufacturer: ManufacturerDoc
): void {
  assert.equal(returnedManufacturer.name, testManufacturer.name);
  assert.equal(returnedManufacturer.crmUser, testManufacturer.crmUser);
  assert.deepEqual(returnedManufacturer.contacts, testManufacturer.contacts);
}

describe('manufacturerById', () => {
  it('should return a manufacturer if it exists in the DB', async () => {
    const testManufacturer = await generateTestManufacturer();
    const res = await Globals.send(
      queries.getById('manufacturer', testManufacturer._id)
    );
    assert.equal(res.status, 200);
    assert.typeOf(res.body, 'object');
    const returnedManufacturer: ManufacturerDoc =
      res.body.data.manufacturerById;
    assertManufacturerFields(returnedManufacturer, testManufacturer);
  });
});

describe('manufacturerRemoveById', () => {
  it('should delete a manufacturer if it exists', async () => {
    const testManufacturer = await generateTestManufacturer();
    const deleteRes = await Globals.send(
      queries.removeById('manufacturer', testManufacturer._id)
    );
    assert.equal(deleteRes.status, 200);
    assert.typeOf(deleteRes.body, 'object');
    const returnedManufacturer =
      deleteRes.body.data.manufacturerRemoveById.record;
    assertManufacturerFields(returnedManufacturer, testManufacturer);
    const getRes = await Globals.send(
      queries.getById('manufacturer', testManufacturer._id)
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.typeById, null);
  });
});
