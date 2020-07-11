import chai from 'chai';
import chaiHttp from 'chai-http';
import Globals from './Globals';

// Configure chai
chai.use(chaiHttp);

// Use the assert style
const assert = chai.assert;

describe('POST /api/user', () => {
  it('should create a new user', async () => {
    try {
      const userResponse = await chai
        .request(Globals.app)
        .post('/api/user')
        .send({
          userName: 'testUser',
        });
      assert.equal(userResponse.status, 201);
      assert.typeOf(userResponse.body, 'object');
      assert.typeOf(userResponse.body._id, 'string');
      assert.equal(userResponse.body.userName, 'testUser');
      Globals.testUser = userResponse.body;
    } catch (err) {
      assert.isNull(err);
    }
  });
});
