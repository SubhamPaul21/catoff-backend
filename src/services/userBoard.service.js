const { Player, Challenge } = require('../models/index');
const { Op } = require('sequelize');
const { Transaction } = require('../models/index'); // Adjust the path as necessary

const getUserCurrentStandings = async (userId) => {
  try {
    // Step 1: Fetch all player records for the given userId
    const userChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Challenge,
          attributes: ['ChallengeID', 'ChallengeType'],
        },
      ],
      attributes: ['ChallengeID'],
    });

    // Step 2: Extract ChallengeIDs
    const challengeIds = userChallenges.map((uc) => uc.ChallengeID);

    // Prepare the final results array
    const results = [];

    // Step 3: Fetch all player records for each ChallengeID and calculate ranks
    for (const challengeId of challengeIds) {
      const playersInChallenge = await Player.findAll({
        where: { ChallengeID: challengeId },
        include: [
          {
            model: Challenge,
            attributes: ['ChallengeID', 'ChallengeType'],
          },
        ],
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
      const currentUserRank = rankedPlayers.find((rp) => rp.userId === userId);

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
    const formattedResults = results.reduce(
      (acc, result, index) => ({
        ...acc,
        [index]: result,
      }),
      {}
    );

    return formattedResults;
  } catch (error) {
    console.error('Error fetching user standings:', error);
    throw error;
  }
};

// Helper function to format date as YYYY-MM-DD HH:MM where MM is the nearest 15-minute block
const formatToNearest15Min = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const nearest15Min = minutes - (minutes % 15);
  return `${date.toISOString().split('T')[0]} ${String(hours).padStart(2, '0')}:${String(nearest15Min).padStart(2, '0')}`;
};

const getUserProgressData = async (userId, period) => {
  let dateFrom;
  let aggregateByInterval = false; // Adjusted from aggregateByHour for clarity

  switch (period) {
    case '30days':
      dateFrom = new Date(new Date().setDate(new Date().getDate() - 30));
      break;
    case '24hours':
      dateFrom = new Date(
        new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000)
      );
      aggregateByInterval = true; // We'll aggregate by the nearest 15-minute interval
      break;
    case 'all':
      dateFrom = new Date(0); // Start from the Unix Epoch (1970-01-01)
      break;
    default:
      throw new Error('Invalid period specified');
  }

  const transactions = await Transaction.findAll({
    where: {
      UserID: userId,
      Timestamp: {
        [Op.gte]: dateFrom,
      },
    },
    order: [['Timestamp', 'ASC']],
    attributes: ['Amount', 'Timestamp'],
  });

  // Aggregate data for graph
  const aggregatedData = transactions.reduce((acc, { Amount, Timestamp }) => {
    const key = aggregateByInterval
      ? formatToNearest15Min(Timestamp)
      : Timestamp.toISOString().split('T')[0];
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += Amount;
    return acc;
  }, {});

  // Convert aggregatedData into the desired format for the response
  const creditsGraph = Object.entries(aggregatedData).map(
    ([time, creditsEarned]) => ({
      time,
      creditsEarned,
    })
  );

  return {
    creditsGraph,
    // You can add more graphs or data as needed
  };
};

module.exports = {
  getUserCurrentStandings,
  getUserProgressData,
};
