import mongoose from 'mongoose';

import { TRUser, TimeReport } from '../src/models/TRUser';
import { invalidWeek, invalidHours } from '../src/controllers/timeReport'

describe("Verifies time report user", () => {
  // beforeAll(async () => {
  //   await mongoose.connect('mongodb://siriusUser:password1@ds263640.mlab.com:63640/sirius', { useNewUrlParser: true, useCreateIndex: true }, (err: string) => {
  //       if (err) {
  //           console.error(err);
  //           process.exit(1);
  //       }
  //   });
  // });

  it("Firstname, lastname and email should be provided", () => {
    const new_user = new TRUser({
      firstname: undefined,
      lastname: undefined,
      email: undefined
    })

    const error = new_user.validateSync()

    const firstname_error = error.errors.firstname.message;
    const lastname_error = error.errors.lastname.message;
    const email_error = error.errors.email.message;

    expect(firstname_error).toBe('Firstname is required');
    expect(lastname_error).toBe('Lastname is required');
    expect(email_error).toBe('Email is required');
  });

  it('Checks that user provide correct email adress', () => {
    const new_user = new TRUser({
      firstname: 'Michael',
      lastname: 'Lennartsson',
      email: 'michaellennartsson.com'
    });

    const error = new_user.validateSync();
    const email_error = error.errors.email.message;
    expect(email_error).toBe('Validator failed for path `email` with value `michaellennartsson.com`');
  })

  it('User is created correctly', () => {
    const new_user = new TRUser({
      firstname: 'Michael',
      lastname: 'Lennartsson',
      email: 'michael.lennartsson@gmail.com'
    });

    const error = new_user.validateSync();
    expect(error).toBe(undefined);
  })

  // it('Creates and store a new user in database', () => {
  //   const new_user = new TRUser({
  //     firstname: 'Michael',
  //     lastname: 'Lennartsson',
  //     email: 'michael.lennartsson@gmail.com'
  //   });

  //   new_user.save()
  // })

  it('Verifies invalidWeek function', () => {
    let new_user = new TRUser({
      firstname: 'Michael',
      lastname: 'Lennartsson',
      email: 'michael.lennartsson@gmail.com',
      timeReport: []
    });

    new_user.timeReport.push({
      week: 17,
      activity: [ 'Consultat', 'Internal' ],
      hours: {
        monday: [ 8, 0 ],
        thuesday: [ 8, 0 ],
        wednesday: [ 8, 0 ],
        thursday: [ 8, 0 ],
        friday: [ 4, 4 ],
        saturday: [ 0, 0 ],
        sunday: [ 0, 0 ] }
      }
    )

    expect(invalidWeek(0, new_user.timeReport)).toBe(true)
    expect(invalidWeek(1, new_user.timeReport)).toBe(false)
    expect(invalidWeek(17, new_user.timeReport)).toBe(true)
    expect(invalidWeek(60, new_user.timeReport)).toBe(true)
  })

  it('Verifies time report hours', () => {

    let report: TimeReport = {
      week: 17,
      activity: [ 'Consultat', 'Internal' ],
      hours: {
        monday: [ 8, 0 ],
        thuesday: [ 8, 0 ],
        wednesday: [ 8, 0 ],
        thursday: [ 8, 0 ],
        friday: [ 4, 4 ],
        saturday: [ 0, 0 ],
        sunday: [ 0, 0 ]
      }
    }
    expect(invalidHours(report)).toBe(false)

    report.hours.monday = [20, 10]
    expect(invalidHours(report)).toBe(true)

    report.hours.monday = [-2, 10]
    expect(invalidHours(report)).toBe(true)
  })

});