const weetsController = require('./controllers/weets');
const usersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');
const validateBySchema = require('./middlewares/validations');
const signUpSchema = require('./schemas/user_signup');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/weets', weetsController.generateWeet);
  app.post('/users', validateBySchema(signUpSchema), usersController.signUp);
  app.post('/users/sessions', [], usersController.signIn);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
