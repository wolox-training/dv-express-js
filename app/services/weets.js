const api = require('../../config/axios');
const { User, Weet, Rating, sequelize } = require('../models/index');
const errors = require('../errors');

const fetchWeet = async user => {
  try {
    const { data } = await api.get('/random');
    if (data.length > 140) {
      return Promise.reject(
        errors.defaultError('The content of the weet exceeds 140 characters. Try again.')
      );
    }
    const created = await Weet.create({ userId: user.id, content: data });
    if (!created) {
      return Promise.reject(errors.databaseError('Weet could not be created in database.'));
    }
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(errors.databaseError('Could not establish connection with the api'));
  }
};

const readWeets = async ({ page = 1, limit = 5 }) => {
  const offset = (page - 1) * limit;
  try {
    const { count: totalItems, rows: weets } = await Weet.findAndCountAll({ limit, offset });
    if (totalItems === 0) {
      return Promise.resolve({ noWeets: 'There are no weets to show.' });
    }
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    if (page > totalPages) {
      return Promise.reject(errors.badRequestError('Page requested exceed the total of pages.'));
    }
    return Promise.resolve({ totalItems, weets, totalPages, currentPage });
  } catch (error) {
    return Promise.reject(errors.databaseError('Some error occurred while getting weets'));
  }
};

const rating = async (ratingUserId, weetId, score) => {
  const transaction = await sequelize.transaction();
  try {
    const ratedWeet = await Weet.findOne({ where: { id: weetId }, transaction });
    if (!ratedWeet) {
      return Promise.reject(errors.notFoundError('Could not find the weet requested'));
    }

    const alreadyRated = await Rating.findOne({ where: { ratingUserId, weetId }, transaction });
    if (alreadyRated) {
      if (alreadyRated.score === score) {
        return Promise.reject(errors.badRequestError('You already rated this weet'));
      }
      alreadyRated.score = score;
      await alreadyRated.save({ transaction });
    } else {
      await Rating.create({ ratingUserId, weetId, score }, { transaction });
    }

    const userRatedWeets = await Weet.findAll({
      where: { userId: ratedWeet.dataValues.userId },
      transaction
    }).map(weet => weet.dataValues.id);
    const totalPoints = await Rating.findAll({
      where: { weetId: userRatedWeets },
      transaction
    })
      .map(rate => rate.dataValues.score)
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    const userRated = await User.findOne({ where: { id: ratedWeet.dataValues.userId }, transaction });
    await User.setPosition(userRated, totalPoints, { transaction });

    await transaction.commit();
    return Promise.resolve();
  } catch (err) {
    if (transaction.rollback) await transaction.rollback();
    throw err;
  }
};

module.exports = {
  fetchWeet,
  readWeets,
  rating
};
