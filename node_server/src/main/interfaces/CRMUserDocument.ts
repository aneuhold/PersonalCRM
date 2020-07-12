import mongoose, { Document } from 'mongoose';
import { UserDoc } from '../models/user';

const ObjectId = mongoose.Types.ObjectId;

/**
 * Used to add on the CRMUserDocument interface to a schema.
 */
export const crmUserDocument = {
  crmUser: {
    type: ObjectId,
    required: true,
  },
};

/**
 * The type representing an CRMUserDocument in the database. This can be
 * implemented to make a document reference a particular user.
 */
export default interface CRMUserDocument extends Document {
  crmUser: UserDoc['_id'];
}
