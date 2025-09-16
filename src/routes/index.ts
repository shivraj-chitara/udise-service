import { Router } from 'express';

import { testApis } from './testRoutes';
import { healthCheck } from '../controllers/healthCheckController';
import { authApis } from './authRoutes';
import { userApis } from './userRoutes';
import { schoolApis } from './schoolRoutes';

export const apis = Router();

apis.get('/healthcheck', healthCheck);
apis.use('/test', testApis);
apis.use('/auth', authApis);
apis.use('/user', userApis);
apis.use('/school', schoolApis);
