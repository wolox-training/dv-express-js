const weetsService = require('../services/weets');
const usersService = require('../services/users');
const ratingServices = require('../services/ratings');
const db = require('../models');
const errors = require('../errors');

const prepareDataToRate = async weetId => {
  try {
    const ratedWeet = await weetsService.getWeet(weetId);
    const weetsRatedUser = await weetsService.getUserWeets(ratedWeet.dataValues.userId);
    const ratedUser = await usersService.getUser(ratedWeet.dataValues.userId);
    return { weetsRatedUser, ratedUser };
  } catch (error) {
    throw error;
  }
};

const postRating = async (ratingUserId, weetId, score, { weetsRatedUser, ratedUser }) => {
  const transaction = await db.sequelize.transaction();
  try {
    const alreadyRated = await ratingServices.getRating(ratingUserId, weetId, { transaction });
    if (alreadyRated) {
      if (alreadyRated.score === score) {
        throw errors.badRequestError('You already rated this weet');
      }
      alreadyRated.score = score;
      await alreadyRated.save({ transaction });
    } else {
      await ratingServices.createRating(ratingUserId, weetId, score, { transaction });
    }

    const totalPoints = await db.Rating.sum('score', { where: { weetId: weetsRatedUser }, transaction });

    await db.User.setPosition(ratedUser, totalPoints, { transaction });

    await transaction.commit();
    return;
  } catch (error) {
    if (transaction.rollback) await transaction.rollback();
    throw error;
  }
};

module.exports = { postRating, prepareDataToRate };
