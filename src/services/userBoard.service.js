const { Player, Challenge } = require('../models/index');
const { Op } = require('sequelize');

const getUserCurrentStandings = async (userId) => {
  try {
    // Step 1: Fetch all player records for the given userId
    const userChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [{
        model: Challenge,
        attributes: ['ChallengeID', 'ChallengeType'],
      }],
      attributes: ['ChallengeID'],
    });

    // Step 2: Extract ChallengeIDs
    const challengeIds = userChallenges.map(uc => uc.ChallengeID);

    // Prepare the final results array
    const results = [];

    // Step 3: Fetch all player records for each ChallengeID and calculate ranks
    for (const challengeId of challengeIds) {
      const playersInChallenge = await Player.findAll({
        where: { ChallengeID: challengeId },
        include: [{
          model: Challenge,
          attributes: ['ChallengeID', 'ChallengeType'],
        }],
        attributes: ['UserID', 'Value', 'ChallengeID'],
        order: [['Value', 'DESC']],
      });

      // Calculate rank
      const rankedPlayers = playersInChallenge.map((player, index) => ({
        userId: player.UserID,
        value: player.Value,
        rank: index + 1, // Rank based on ordering by Value
      }));

      // Find the rank of the current user
      const currentUserRank = rankedPlayers.find(rp => rp.userId === userId);

      if (currentUserRank) {
        // Each challenge is one JSON entry
        results.push({
          challengeId: challengeId, 
          challengeType: playersInChallenge[0].Challenge.ChallengeType, // Assuming ChallengeType is consistent within the challenge
          currentValue: currentUserRank.value,
          rank: currentUserRank.rank,
        });
      }
    }

    // Convert results to the specified format
    const formattedResults = results.reduce((acc, result, index) => ({
      ...acc,
      [index]: result
    }), {});

    return formattedResults;
  } catch (error) {
    console.error('Error fetching user standings:', error);
    throw error;
  }
};

module.exports = {
  getUserCurrentStandings,
};
