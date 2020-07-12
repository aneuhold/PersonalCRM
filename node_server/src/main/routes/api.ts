import express, { Router } from 'express';
const router = express.Router();
import mongoose, { Model, Document } from 'mongoose';
import { createUserModel } from '../models/user';
import { crmModelName } from '../models/crmModels';
import { createOpportunityModel } from '../models/opportunity';
import { createTaskModel } from '../models/task';
import { createAccountModel } from '../models/account';

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
    task: createTaskModel(db),
    account: createAccountModel(db),
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

  /**
   * Creates a new document of the given type with the properties provided in
   * the `req.body`.
   */
  router.post('/:type', async (req, res) => {
    try {
      if (Object.keys(models).includes(req.params.type)) {
        const type = req.params.type as crmModelName;
        const Model = models[type];
        const newDoc = new Model(req.body);
        await newDoc.save();
        res.status(201).json(newDoc);
      } else {
        throw new Error(`Type "${req.params.type} not found."`);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  /**
   * Patches the given type of document and the ID with the provided request
   * body.
   */
  router.patch('/:type/:id', async (req, res) => {
    try {
      if (Object.keys(models).includes(req.params.type)) {
        const type = req.params.type as crmModelName;
        const doc = checkId(type, req.params.id);

        // Make sure no sneaky stuff is happenin 😅
        if (req.body._id) {
          delete req.body._id;
        }
        const updatedDoc = Object.assign(doc, req.body);
        await updatedDoc.save();
        res.status(200).json(updatedDoc);
      } else {
        throw new Error(`Type "${req.params.type} not found."`);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  /**
   * Deletes the provided document type of the provided ID.
   */
  router.delete('/:type/:id', async (req, res) => {
    try {
      if (Object.keys(models).includes(req.params.type)) {
        const type = req.params.type as crmModelName;
        const Model = models[type];
        const docToDelete = await Model.findById(req.params.id).exec();
        if (!docToDelete) {
          throw new Error(`Document with ID: "${req.params.id}" not found`);
        } else {
          await docToDelete.remove();
        }
        res.status(200).json(docToDelete);
      } else {
        throw new Error(`Type "${req.params.type} not found."`);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  return router;
}

export default createApiRouter;
