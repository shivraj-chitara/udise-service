import mongoose from 'mongoose';

export interface ISchool {
  school_name: string;
  udise_code: string;
  state_mgmt: string;
  location: string;
  school_type: string;
  state: string;
  district: string;
  block: string;
  village: string;
  isDeleted?: boolean;
}

export interface ISchoolDocument extends ISchool, mongoose.Document {}

export const schoolSchema = new mongoose.Schema<ISchoolDocument>(
  {
    school_name: {
      type: String,
      required: true
    },
    udise_code: {
      type: String
    },
    state_mgmt: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    school_type: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    block: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, collection: 'Schools' }
);

schoolSchema.index({ state: 1, district: 1, block: 1, village: 1 });
schoolSchema.index({ state: 1, district: 1 });

export const SchoolModel = mongoose.model<ISchoolDocument>(
  'School',
  schoolSchema
);
