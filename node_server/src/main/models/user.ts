import mongoose, { Model, Schema, Document } from 'mongoose';
import { createOpportunityModel } from './opportunity';

const ObjectId = mongoose.Types.ObjectId;

/**
 * The mongoose schema for a User in the database.
 */
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  dateCreated: { type: Date, default: Date.now },

  /**
   * Lists out the open documents for the user in order.
   */
  openDocuments: {
    type: [
      {
        docType: String,
        id: ObjectId,
      },
    ],
    default: [],
  },
});

/**
 * The type representing a User document in the database.
 */
export interface UserDoc extends Document {
  userName: string;
  dateCreated: Date;
  openDocuments: [
    {
      doctype: string;
      id: typeof ObjectId;
    }
  ];
}

/**
 * A `User` class that represents a user in the MongoDB. This extends
 * the mongoose `Model` type.
 *
 * This can be used for example with:
 * ```
 * let newUser = new User({userName: 'daxxn'});
 * ```
 */
export type UserModel = Model<UserDoc>;

/**
 * Creates a `User` model from a given connected mongoose MongoDB database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {UserModel} the `User` class
 */
export function createUserModel(db: typeof mongoose): UserModel {
  /**
   * When a user is deleted, remove all of their associated documents as well.
   * This needs to be manually updated with any new collections that implement
   * `CRMUserdocument`.
   */
  userSchema.pre('remove', async function () {
    const Opportunity = createOpportunityModel(db);
    await Opportunity.deleteMany({ crmUser: this._id });
  });

  return db.model('User', userSchema);
}
