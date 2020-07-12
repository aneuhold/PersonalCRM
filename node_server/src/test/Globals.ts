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
}
