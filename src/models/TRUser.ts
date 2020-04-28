import mongoose from 'mongoose';

export type TRUserDocument = mongoose.Document & {
  firstname: string;
  lastname: string;
  email: string;
  timeReport: TimeReport[];
}

export interface TimeReport {
  week: number;
  activity: string[];
  hours: Days
}

export interface Days {
  monday: number[];
  thuesday: number[];
  wednesday: number[];
  thursday: number[];
  friday: number[];
  saturday: number[];
  sunday: number[];
}

const Schema = mongoose.Schema;

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
  timeReport: Array
});

/**
 * Validates email edress
 */
function validateEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const TRUser = mongoose.model<TRUserDocument>("TRUser", UserScheam);
