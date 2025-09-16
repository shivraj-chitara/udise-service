import { Router } from 'express';
import asyncFunction from 'express-async-handler';
import { UserController } from '../controllers/userController';
import { ensureAuthentication } from '../middleware/auth';

export const userApis = Router();

userApis.get(
  '/getUser',
  ensureAuthentication,
  asyncFunction(UserController.getUser)
);
