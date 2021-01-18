const weetsController = require('./controllers/weets');
const usersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');
const validateBySchema = require('./middlewares/validations');
const { signUpSchema, signInSchema } = require('./schemas/users');
const auth = require('./middlewares/auth');
const checkIfEmailExists = require('./middlewares/emailValidation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/weets', weetsController.generateWeet);

  app.post('/users', [validateBySchema(signUpSchema), checkIfEmailExists], usersController.signUp);
  app.post('/users/sessions', validateBySchema(signInSchema), usersController.signIn);
  app.get('/users', auth, usersController.usersList);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
