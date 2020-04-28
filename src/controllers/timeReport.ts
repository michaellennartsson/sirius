import { Request, Response } from 'express';

import { TRUser } from '../models/TRUser';
import { TimeReport } from '../models/TimeReport'

/**
 * GET /new-truser
 * Create new TRUser page.
 */
export const getCreateTRUer = (req: Request, res: Response) => {
  res.render('new-truser', {
    title: 'New TRUser',
  });
};

/**
 * POST /new-truser
 * Create new Time Report User.
 */
export const createTRUer = async (req: Request, res: Response) => {

  const new_user = new TRUser({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });
  
  try {
    await new_user.save()
    res.send("User created!")
  } catch(err) {
    console.log(err)
    res.send('User could not be created!')
  }
};


/**
 * GET /time-report
 * Time Report form page.
 */
export const getTimeReport = (req: Request, res: Response) => {
  res.render('time-report', {
    title: 'Time Report',
  });
};


/**
 * POST /time-report
 * Adds a new time report to a user
 */
export const sendTimeReport = async (req: Request, res: Response) => {

  let user = await TRUser.findOne({email: req.body.email})
  if (!user) {
    res.send('User does not exist!')
    return
  }

  const report: TimeReport = convertInput(req)
  if(invalidHours(report)){
    res.send('Reported hours are not vavid!');
    return
  }

  if (invalidWeek(report.week, user.timeReport)) {
    res.send(`Week is already reported or out of range`)
    return
  }

  user.timeReport.push(report)

  try {
    await user.save()
    res.send("Time report saved!")
  } catch(err) {
    console.log(err)
    res.send('Time report could not be saved!')
  }

};


/**
 * Checks is week is out of range 1 - 52 or if report aöready exists
 */
export const invalidWeek = (weekNr: number, reports: TimeReport[]) => {
  if(weekNr < 1 || weekNr > 52) return true

  if(reports.find( report => report.week === weekNr)) return true

  return false
}

/**
 * Converting input from user to TimeReport
 */
const convertInput = (req: Request) => {
  const days = ['monday', 'thuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let result: TimeReport = {
    week: parseInt(req.body.week),
    activity: req.body.activity,
    hours: {
      monday: req.body.monday.map( (hour: string) => convertHour(hour)),
      thuesday: req.body.thuesday.map( (hour: string) => convertHour(hour)),
      wednesday: req.body.wednesday.map( (hour: string) => convertHour(hour)),
      thursday: req.body.thursday.map( (hour: string) => convertHour(hour)),
      friday: req.body.friday.map( (hour: string) => convertHour(hour)),
      saturday: req.body.saturday.map( (hour: string) => convertHour(hour)),
      sunday: req.body.sunday.map( (hour: string) => convertHour(hour))
    }
  }

  // days.forEach( day => {
  //   result[day] = req.body[day]
  // })

  return result
}

/**
 * Converts string hours to number hours, returns 0 if empty string
 */
const convertHour = (hour: string) => {
  return hour === '' ? 0 : parseInt(hour)
}

/**
 * Checks that no input is negative and not more than 24 hours in a day
 */
export const invalidHours = (report: TimeReport) => {
  const MAX_HOURS: number = 24;
  let result: boolean = false

  // Loop over reported hours e.g [5, 3]
  Object.values(report.hours).forEach( (day: number[]) => {
    let sum: number = 0;
    day.forEach( (activityHour: number) => {
      sum += activityHour;
      if(activityHour < 0) result = true
    })
    
    if(sum > MAX_HOURS) {
      result = true
    }
  })
  
  return result
}



