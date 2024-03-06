// services/player.service.js

const { Op } = require('sequelize');
const Player = require('../models/player.model');
const Challenge = require('../models/challenge.model'); // Adjust the path as necessary

exports.getOngoingChallengesByUserId = async (userId) => {
  try {
    const ongoingChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Challenge,
          where: {
            IsActive: true,
            // Optionally, filter by StartDate and EndDate if you want to find only currently active challenges
            StartDate: { [Op.lte]: new Date() },
            EndDate: { [Op.gte]: new Date() },
          },
          required: true,
        },
      ],
    });
    return ongoingChallenges.map((player) => player.Challenge);
  } catch (error) {
    throw new Error('Error retrieving ongoing challenges for user');
  }
};
