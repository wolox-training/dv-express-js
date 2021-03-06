const weetsController = require('./controllers/weets');
const usersController = require('./controllers/users');
const { healthCheck } = require('./controllers/healthCheck');
const validateBySchema = require('./middlewares/validations');
const { signUpSchema, signInSchema } = require('./schemas/users');
const { rateWeetSchema } = require('./schemas/rateWeet');
const paginationSchema = require('./schemas/pagination');
const verifyAuthentication = require('./middlewares/authentication');
const checkIfEmailExists = require('./middlewares/emailValidation');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/weets', verifyAuthentication, weetsController.generateWeet);
  app.get('/weets', [verifyAuthentication, validateBySchema(paginationSchema)], weetsController.getWeets);
  app.post(
    '/weets/:id/ratings',
    [verifyAuthentication, validateBySchema(rateWeetSchema)],
    weetsController.rateWeet
  );

  app.post('/users', [validateBySchema(signUpSchema), checkIfEmailExists], usersController.signUp);
  app.post('/users/sessions', validateBySchema(signInSchema), usersController.signIn);
  app.post(
    '/admin/users',
    [verifyAuthentication, validateBySchema(signUpSchema)],
    usersController.signUpAdminUser
  );
  app.get('/users', [verifyAuthentication, validateBySchema(paginationSchema)], usersController.getUsersList);
  app.post('/users/sessions/invalidate_all', verifyAuthentication, usersController.invalidateAllSessions);
};
