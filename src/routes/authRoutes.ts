import { Router } from 'express';
import asyncFunction from 'express-async-handler';
import { AuthController } from '../controllers/authController';

export const authApis = Router();

authApis.post('/signup', asyncFunction(AuthController.signup));
authApis.post('/login', asyncFunction(AuthController.login));
authApis.get('/logout', asyncFunction(AuthController.logout));
