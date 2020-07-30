import { Express } from 'express';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { UserDoc } from '../main/models/user';

// Configure chai
chai.use(chaiHttp);

/**
 * Holds the global variables for the tests.
 */
export default class Globals {
  public static app: Express;
  public static testUser: UserDoc;
  public static requester: ChaiHttp.Agent;

  /**
   * Makes a post request to the `/graphql` endpoint with the provided send
   * object.
   *
   * @param {Record<string, unknown>} sendObject the object to send
   * @returns {Promise<ChaiHttp.Response>} the response from the request
   */
  static async send(
    sendObject: Record<string, unknown>
  ): Promise<ChaiHttp.Response> {
    return this.requester.post('/graphql').send(sendObject);
  }
}
