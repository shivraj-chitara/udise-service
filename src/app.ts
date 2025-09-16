import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import { apis } from './routes';
import { healthCheck } from './controllers/healthCheckController';
import { getErrorHandler, notFoundHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', apis);
app.get('/healthcheck', healthCheck);
app.use('*', notFoundHandler);
app.use(getErrorHandler);

export default app;
