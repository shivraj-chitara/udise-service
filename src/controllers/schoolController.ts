import { Request, Response } from 'express';
import { validateJoiSchema } from '../utils/validateJoiSchema';
import Joi from 'joi';
import { SchoolService } from '../services/schoolService';
import { SortOrderEnum } from '../enums/common';

export class SchoolController {
  static async addSchool(req: Request, res: Response) {
    validateJoiSchema({
      schema: Joi.object({
        school_name: Joi.string().required(),
        udise_code: Joi.string().required(),
        state_mgmt: Joi.string().required(),
        location: Joi.string().required(),
        school_type: Joi.string().required(),
        state: Joi.string().required(),
        district: Joi.string().required(),
        block: Joi.string().required(),
        village: Joi.string().required()
      }),
      data: req.body
    });

    await SchoolService.addSchool(req.body);

    res.send({ message: 'School added successfully' });
  }

  static async getSchoolList(req: Request, res: Response) {
    const {
      page = 1,
      size = 20,
      searchKeyword,
      filters,
      sortBy,
      sortOrder
    } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        page: Joi.number().min(1),
        size: Joi.number().min(1).max(100),
        searchKeyword: Joi.string().allow(''),
        filters: Joi.object({
          state: Joi.string().allow(''),
          district: Joi.string().allow(''),
          block: Joi.string().allow(''),
          village: Joi.string().allow('')
        }),
        sortBy: Joi.string().trim().allow(''),
        sortOrder: Joi.string()
          .valid(...Object.values(SortOrderEnum))
          .allow('')
      }),
      data: { page, size, searchKeyword, filters, sortBy, sortOrder }
    });

    const data = await SchoolService.getSchoolList({
      page,
      size,
      searchKeyword,
      filters,
      sortBy,
      sortOrder
    });

    res.send(data);
  }

  static async getSchool(req: Request, res: Response) {
    const { schoolId } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        schoolId: Joi.string().hex().length(24).required()
      }),
      data: { schoolId }
    });

    const data = await SchoolService.getSchool({ schoolId });
    res.send(data);
  }

  static async updateSchool(req: Request, res: Response) {
    validateJoiSchema({
      schema: Joi.object({
        schoolId: Joi.string().hex().length(24).required(),
        school_name: Joi.string(),
        udise_code: Joi.string(),
        state_mgmt: Joi.string(),
        location: Joi.string(),
        school_type: Joi.string(),
        state: Joi.string(),
        district: Joi.string(),
        block: Joi.string(),
        village: Joi.string()
      }),
      data: { ...req.body }
    });

    await SchoolService.updateSchool({ ...req.body });
    res.send({ message: 'School updated successfully' });
  }

  static async deleteSchool(req: Request, res: Response) {
    const { schoolId } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        schoolId: Joi.string().hex().length(24).required()
      }),
      data: { schoolId }
    });

    await SchoolService.deleteSchool({ schoolId });
    res.send({ message: 'School Data deleted successfully' });
  }

  static async getDistribution(req: Request, res: Response) {
    const { filters } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        filters: Joi.object({
          state: Joi.string().allow(''),
          district: Joi.string().allow(''),
          block: Joi.string().allow(''),
          village: Joi.string().allow('')
        })
      }),
      data: { filters }
    });

    const data = await SchoolService.getDistribution({ filters });
    res.send(data);
  }

  static async getStates(req: Request, res: Response) {
    const data = await SchoolService.getStates();
    res.send({ states: data });
  }

  // Get districts based on state
  static async getDistricts(req: Request, res: Response) {
    const { state } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        state: Joi.string().required()
      }),
      data: { state }
    });

    const data = await SchoolService.getDistricts({ state });
    res.send({ districts: data });
  }

  // Get blocks based on state and district
  static async getBlocks(req: Request, res: Response) {
    const { state, district } = req.query as any;

    validateJoiSchema({
      schema: Joi.object({
        state: Joi.string().required(),
        district: Joi.string().required()
      }),
      data: { state, district }
    });

    const data = await SchoolService.getBlocks({ state, district });
    res.send({ blocks: data });
  }

  // Get villages based on state, district, and block
  static async getVillages(req: Request, res: Response) {
    const { state, district, block } = req.query as any;

    // Validate state, district, and block parameters
    validateJoiSchema({
      schema: Joi.object({
        state: Joi.string().required(),
        district: Joi.string().required(),
        block: Joi.string().required()
      }),
      data: { state, district, block }
    });

    const data = await SchoolService.getVillages({ state, district, block });

    res.send({ villages: data });
  }
}
