import express, { Router } from 'express';
const router = express.Router();
import mongoose, { Model, Document } from 'mongoose';
import { createUserModel } from '../models/user';
import { crmModelName } from '../models/crmModels';
import { createOpportunityModel } from '../models/opportunity';

/**
 * Creates the express Router for the `/api` endpoint.
 *
 * @param {mongoose} db the connected MongoDB database
 * @returns {Router} the Router for the `/api` endpoint
 */
function createApiRouter(db: typeof mongoose): Router {
  /**
   * The different models that can be used to interact with the database.
   */
  const models: { [modelName: string]: Model<Document> } = {
    user: createUserModel(db),
    opportunity: createOpportunityModel(db),
  };

  /**
   * Checks the given docId in the MongoDB and if there is an error it
   * then "rejects" the promise with the error so it can be used elsewhere.
   * If this is successful, it returns the document.
   *
   * @param {crmModelName} modelType the type of the model
   * @param {string} docId the ID of the document to find
   * @returns {Promise<Document>} the promise that will reject if there is
   * an error or if the doc is not found and resolves if the document
   * is found
   */
  function checkId(modelType: crmModelName, docId: string): Promise<Document> {
    return new Promise<Document>((resolve, reject) => {
      const Model = models[modelType];
      Model.findOne();
      Model.findById(docId).exec((err, doc) => {
        if (err) {
          reject(err);
        } else if (!doc) {
          reject(new Error(`No document found with id: ${docId}`));
        } else {
          resolve(doc);
        }
      });
    });
  }

  /**
   * Gets the given type from the database with the given ID.
   */
  router.get('/:type/:id', async (req, res) => {
    try {
      if (Object.keys(models).includes(req.params.type)) {
        const type = req.params.type as crmModelName;
        const doc = await checkId(type, req.params.id);
        res.status(200).json(doc);
      } else {
        throw new Error(`Type "${req.params.type} not found."`);
      }
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });
  return router;
}

export default createApiRouter;
