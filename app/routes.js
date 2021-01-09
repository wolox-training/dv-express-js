const weetsController = require('./controllers/weets');
const usersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');
const validateBySchema = require('./middlewares/validations');
const signUpSchema = require('./schemas/user_signup');
const uniqueEmail = require('./middlewares/uniqueEmail');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/weets', weetsController.generateWeet);
  app.post('/users', [validateBySchema(signUpSchema), uniqueEmail], usersController.signUp);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
