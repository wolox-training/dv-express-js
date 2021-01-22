const db = require('../models');
const errors = require('../errors');

const createRating = (ratingUserId, weetId, score) =>
  db.Rating.create({ ratingUserId, weetId, score })
    .then(rate => rate)
    .catch(() => Promise.reject(errors.databaseError('The rate could not be created.')));

const getRating = (ratingUserId, weetId) =>
  db.Rating.findOne({
    where: { ratingUserId, weetId },
    attributes: {
      exclude: ['UserId', 'WeetId']
    }
  })
    .then(rate => rate)
    .catch(() => Promise.reject(errors.databaseError('Some error occurred while getting the rating.')));

module.exports = {
  createRating,
  getRating
};
