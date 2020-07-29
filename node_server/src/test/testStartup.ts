import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

/**
 * Setup the global request and keep it open
 */
before(() => {
  Globals.requester = chai.request(Globals.app).keepOpen();
});

describe('Tests startup', () => {
  it('should create a new user given a valid userName', async () => {
    try {
      // Create the new user
      const query = `mutation {
        userCreateOne(record: {
          userName: "Test User"
        }) {
          record {
            _id
            userName
            openDocuments {
              docType,
              id
            }
          }
        }
      }`;
      const userResponse = await Globals.requester.post('/graphql').send({
        query,
      });
      assert.equal(userResponse.status, 200);
      assert.typeOf(userResponse.body, 'object');
      const userRecord = userResponse.body.data.userCreateOne.record;
      assert.typeOf(userRecord._id, 'string');
      assert.equal(userRecord.userName, 'Test User');
      assert.deepEqual(userRecord.openDocuments, []);
      Globals.testUser = userRecord;
    } catch (err) {
      console.log(err);
      assert.isNull(err);
    }
  });
});
