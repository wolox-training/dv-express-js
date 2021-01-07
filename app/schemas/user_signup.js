const db = require('../models');

const signUpSchema = {
  firstName: {
    exists: true,
    notEmpty: true,
    errorMessage: 'First name cannot be empty!'
  },
  lastName: {
    exists: true,
    notEmpty: true,
    errorMessage: 'Last name cannot be empty!'
  },
  email: {
    exists: true,
    isEmail: { errorMessage: 'Not a valid email.' },
    contains: { options: '@wolox.co', errorMessage: 'Email does not belong wolox domain.' },
    notEmpty: { errorMessage: 'email cannot be empty!' },
    custom: {
      options: async value => {
        const user = await db.User.findOne({ where: { email: value } });
        if (user) {
          throw new Error('Email is already registered.');
        }
      }
    },
    trim: true,
    toLowerCase: true
  },
  password: {
    exists: true,
    notEmpty: { errorMessage: 'Password cannot be empty!' },
    isLength: { errorMessage: 'Password must have at least 8 characters.', options: { min: 8 } },
    isAlphanumeric: { errorMessage: 'Password must be alphanumeric.' }
  }
};

module.exports = signUpSchema;
