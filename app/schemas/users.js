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
    matches: {
      options: [/^[\w-.]+@wolox(.)+[(co|ar|cl|mx)]{2,2}$/],
      errorMessage: 'Email does not belong wolox domain.'
    },
    notEmpty: { errorMessage: 'email cannot be empty!' },
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

const signInSchema = {
  email: {
    exists: true,
    isEmail: { errorMessage: 'Not a valid email.' },
    matches: {
      options: [/^[\w-.]+@wolox(.)+[(co|ar|cl|mx)]{2,2}$/],
      errorMessage: 'Email does not belong wolox domain.'
    },
    notEmpty: { errorMessage: 'email cannot be empty!' },
    trim: true,
    toLowerCase: true
  },
  password: {
    exists: true,
    notEmpty: { errorMessage: 'Password cannot be empty!' }
  }
};

module.exports = { signUpSchema, signInSchema };
