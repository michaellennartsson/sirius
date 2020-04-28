import { Schema } from 'mongoose';

const DaysSchema = new Schema({
  monday: [Number],
  thuesday: [Number],
  wednesday: [Number],
  thursday: [Number],
  friday: [Number],
  saturday: [Number],
  sunday: [Number]
})

export const TimeReportSchema = new Schema({
  week: {
    type: Number,
    unique: true
  },
  activity: [String],
  hours: DaysSchema
})

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