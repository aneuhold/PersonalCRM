import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

describe('Tests cleanup', () => {
  it('should delete a user provided a valid ID', done => {
    const testUser = Globals.testUser;
    const query = `mutation($userId:MongoID) {
      userRemoveById(filter: {
        _id: $userId
      }) {
        record {
          _id
          userName
        }
      }
    }`;
    if (testUser) {
      Globals.requester
        .post(`/graphql`)
        .send({
          query,
          variables: {
            userId: testUser._id,
          },
        })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.typeOf(res.body, 'object');
          const userRecord = res.body.data.userRemoveById.record;
          assert.equal(userRecord._id, testUser._id);
          assert.equal(userRecord.userName, testUser.userName);
          done();
        });
    } else {
      done(new Error(`testUser wasn't defined for this session of tests.`));
    }
  });
});

after(() => {
  Globals.requester.close();
});
