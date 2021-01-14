const weetsController = require('./controllers/weets');
const usersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');
const validateBySchema = require('./middlewares/validations');
const { signUpSchema, signInSchema } = require('./schemas/users');
const uniqueEmail = require('./middlewares/uniqueEmail');
const auth = require('./middlewares/auth');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/weets', auth, weetsController.generateWeet);

  app.post('/users', [validateBySchema(signUpSchema), uniqueEmail], usersController.signUp);
  app.post('/users/sessions', validateBySchema(signInSchema), usersController.signIn);
  app.get('/users', auth, usersController.usersList);
  app.post('/admin/users', [auth, validateBySchema(signUpSchema)], usersController.admin);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
