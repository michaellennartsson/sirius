import mongoose, { Schema } from 'mongoose';


export interface ITimeReport {
  week: string;
}

export const TimeReportSchema = new Schema({
  week: {
    type: String,
    required: [true, 'Week must be provided'],
    unique : true
  }
})