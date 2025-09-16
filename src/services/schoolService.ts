import createHttpError from 'http-errors';
import { ISchool, SchoolModel } from '../models/schoolModel';
import { SchoolSortByFieldEnum } from '../enums/school';
import { SortOrderEnum } from '../enums/common';

export class SchoolService {
  static async getSchoolList(payload: {
    page: number;
    size: number;
    searchKeyword?: string;
    filters?: {
      state?: string;
      district?: string;
      block?: string;
      village?: string;
    };
    sortOrder?: SortOrderEnum;
    sortBy?: SchoolSortByFieldEnum;
  }) {
    const { page, size, searchKeyword, filters, sortBy, sortOrder } = payload;

    const query: any = {
      isDeleted: { $ne: true }
    };
    let sortParam: any = {
      createdAt: -1,
      _id: 1
    };

    if (searchKeyword) {
      query.school_name = {
        $regex: searchKeyword,
        $options: 'i'
      };
    }

    if (filters) {
      if (filters?.state) {
        query.state = filters.state;
      }
      if (filters?.district) {
        query.district = filters.district;
      }
      if (filters?.block) {
        query.block = filters.block;
      }
      if (filters?.village) {
        query.village = filters.village;
      }
    }

    if (
      sortBy &&
      sortOrder &&
      Object.values(SortOrderEnum).includes(sortOrder) &&
      Object.values(SchoolSortByFieldEnum).includes(sortBy)
    ) {
      sortParam = {
        [sortBy]: sortOrder === SortOrderEnum.ASC ? 1 : -1,
        _id: 1
      };
    }

    const [totalCount, data] = await Promise.all([
      SchoolModel.countDocuments(query),
      SchoolModel.find(query)
        .sort(sortParam)
        .skip((page - 1) * size)
        .limit(size)
        .lean()
    ]);

    return {
      totalCount,
      data
    };
  }

  static async getSchool(payload: { schoolId: string }) {
    const { schoolId } = payload;

    const school = await SchoolModel.findOne({
      _id: schoolId,
      isDeleted: { $ne: true }
    }).lean();
    if (!school) {
      throw new createHttpError.NotFound('School not found');
    }

    return school;
  }

  static async addSchool(payload: ISchool) {
    const schoolExistWithudise_code = await SchoolModel.findOne({
      udise_code: payload.udise_code
    });

    if (schoolExistWithudise_code) {
      throw new createHttpError.BadRequest(
        'School with this UDISE code already exists'
      );
    }

    await SchoolModel.create(payload);
  }

  static async updateSchool(payload: ISchool & { schoolId: string }) {
    const { schoolId } = payload;

    const school = await SchoolModel.findById(schoolId);
    if (!school) {
      throw new createHttpError.NotFound('School not found');
    }

    if (payload.udise_code && payload.udise_code !== school.udise_code) {
      const schoolExistWithudise_code = await SchoolModel.findOne({
        udise_code: payload.udise_code
      });

      if (schoolExistWithudise_code) {
        throw new createHttpError.BadRequest(
          'School with this UDISE code already exists'
        );
      }
    }

    await SchoolModel.updateOne({ _id: schoolId }, { $set: payload });
  }

  static async deleteSchool(payload: { schoolId: string }) {
    const { schoolId } = payload;

    const school = await SchoolModel.findById(schoolId);
    if (!school) {
      throw new createHttpError.NotFound('School not found');
    }

    await SchoolModel.updateOne(
      { _id: schoolId },
      { $set: { isDeleted: true } }
    );
  }

  static async getDistribution(payload: {
    filters?: {
      state?: string;
      district?: string;
      block?: string;
      village?: string;
    };
  }) {
    const { filters } = payload;
    const query: any = {
      isDeleted: { $ne: true }
    };

    if (filters) {
      if (filters?.state) {
        query.state = filters.state;
      }
      if (filters?.district) {
        query.district = filters.district;
      }
      if (filters?.block) {
        query.block = filters.block;
      }
      if (filters?.village) {
        query.village = filters.village;
      }
    }

    const pipeline: any[] = [
      { $match: query },
      {
        $facet: {
          managementTypeDistribution: [
            { $group: { _id: '$state_mgmt', count: { $sum: 1 } } },
            {
              $project: {
                _id: 0,
                label: { $ifNull: ['$_id', 'Unknown'] },
                count: 1
              }
            },
            { $sort: { count: -1 } }
          ],
          locationDistribution: [
            { $group: { _id: '$location', count: { $sum: 1 } } },
            {
              $project: {
                _id: 0,
                label: { $ifNull: ['$_id', 'Unknown'] },
                count: 1
              }
            },
            { $sort: { count: -1 } }
          ],
          schoolTypeDistribution: [
            { $group: { _id: '$school_type', count: { $sum: 1 } } },
            {
              $project: {
                _id: 0,
                label: { $ifNull: ['$_id', 'Unknown'] },
                count: 1
              }
            },
            { $sort: { count: -1 } }
          ]
        }
      }
    ];

    const result = await SchoolModel.aggregate(pipeline);

    const data = result[0];

    return {
      managementTypeDistribution: data?.managementTypeDistribution || [],
      locationDistribution: data?.locationDistribution || [],
      schoolTypeDistribution: data?.schoolTypeDistribution || []
    };
  }

  // static async getFilters() {
  // }

  static async getStates() {
    const data = await SchoolModel.distinct('state', { state: { $ne: null } });
    return data;
  }

  static async getDistricts(payload: { state: string }) {
    const { state } = payload;
    const data = await SchoolModel.distinct('district', { state });
    return data;
  }
  static async getBlocks(payload: { state: string; district: string }) {
    const { state, district } = payload;

    const data = await SchoolModel.distinct('block', { state, district });
    return data;
  }
  static async getVillages(payload: {
    state: string;
    district: string;
    block: string;
  }) {
    const { state, district, block } = payload;
    const data = await SchoolModel.distinct('village', {
      state,
      district,
      block
    });
    return data;
  }
}
