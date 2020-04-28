import mongoose, { Document, Schema } from 'mongoose';

import { TimeReportSchema, TimeReport } from './TimeReport'

export type TRUserDocument = Document & {
  firstname: string;
  lastname: string;
  email: string;
  timeReport: TimeReport[];
}

const UserScheam = new Schema({
  firstname: {
    type: String,
    validate: {
      validator: (firstname: string) => firstname.length > 0,
    },
    required: [true, 'Firstname is required']
  },
  lastname: {
    type: String,
    validate: {
      validator: (lastname: string) => lastname.length > 0,
    },
    required: [true, 'Lastname is required']
  },
  email: {
    type: String,
    validate: {
      validator: validateEmail,
    },
    required: [true, 'Email is required'],
    unique : true
  },
  timeReport: [TimeReportSchema]
});

/**
 * Validates email edress
 */
function validateEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const TRUser = mongoose.model<TRUserDocument>("TRUser", UserScheam);
