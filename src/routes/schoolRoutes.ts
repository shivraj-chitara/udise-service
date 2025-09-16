import { Router } from 'express';
import asyncFunction from 'express-async-handler';
import { SchoolController } from '../controllers/schoolController';
import { ensureAuthentication } from '../middleware/auth';

export const schoolApis = Router();

schoolApis.get(
  '/getSchoolList',
  ensureAuthentication,
  asyncFunction(SchoolController.getSchoolList)
);
schoolApis.get(
  '/getSchool',
  ensureAuthentication,
  asyncFunction(SchoolController.getSchool)
);
schoolApis.get(
  '/getDistribution',
  ensureAuthentication,
  asyncFunction(SchoolController.getDistribution)
);
schoolApis.post(
  '/addSchool',
  ensureAuthentication,
  asyncFunction(SchoolController.addSchool)
);
schoolApis.put(
  '/updateSchool',
  ensureAuthentication,
  asyncFunction(SchoolController.updateSchool)
);
schoolApis.delete(
  '/deleteSchool',
  ensureAuthentication,
  asyncFunction(SchoolController.deleteSchool)
);

schoolApis.get(
  '/getStates',
  ensureAuthentication,
  asyncFunction(SchoolController.getStates)
);
schoolApis.get(
  '/getDistricts',
  ensureAuthentication,
  asyncFunction(SchoolController.getDistricts)
);
schoolApis.get(
  '/getBlocks',
  ensureAuthentication,
  asyncFunction(SchoolController.getBlocks)
);
schoolApis.get(
  '/getVillages',
  ensureAuthentication,
  asyncFunction(SchoolController.getVillages)
);
