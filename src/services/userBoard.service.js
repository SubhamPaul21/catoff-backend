const { Player, Challenge, Transaction, Users } = require('../models/index');
const { Op } = require('sequelize');
const logger = require('../utils/logger'); // Ensure this path is correct for your logger setup

const getUserCurrentStandings = async (userId) => {
  logger.debug(
    `[UserService] Fetching current standings for user ID: ${userId}`
  );
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
        results.push({
          challengeId: challengeId,
          challengeType: playersInChallenge[0].Challenge.ChallengeType,
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

    logger.info(
      `[UserService] Current standings fetched successfully for user ID: ${userId}`
    );
    return formattedResults;
  } catch (error) {
    logger.error(
      `[UserService] Error fetching user standings for user ID: ${userId}: ${error}`
    );
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
  logger.debug(
    `[UserService] Fetching user progress data for ID: ${userId}, Period: ${period}`
  );
  let dateFrom;
  let aggregateByInterval = false; // Adjusted for clarity

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
      logger.error(
        '[UserService] Invalid period specified for user progress data'
      );
      throw new Error('Invalid period specified');
  }

  try {
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
      if (!acc[key]) acc[key] = 0;
      acc[key] += Amount;
      return acc;
    }, {});

    const creditsGraph = Object.entries(aggregatedData).map(
      ([time, creditsEarned]) => ({ time, creditsEarned })
    );

    logger.info(
      `[UserService] User progress data fetched successfully for ID: ${userId}`
    );
    return { creditsGraph };
  } catch (error) {
    logger.error(
      `[UserService] Error fetching user progress data for ID: ${userId}: ${error}`
    );
    throw error;
  }
};

const getUserDetailsData = async (userId) => {
  logger.debug(`[UserService] Fetching user details data for ID: ${userId}`);
  try {
    // Fetch user basic details
    const user = await User.findOne({
      where: { UserID: userId },
      include: [{ 
        model: WalletAddress,
        attributes: ['WalletAddress'] // Assuming WalletAddress model has a WalletAddress field
      }],
      attributes: ['UserID', 'Email', 'UserName', 'WalletID', 'Credits']
    });

    if (!user) {
      logger.info(`[UserService] User not found for ID: ${userId}`);
      throw new Error('User not found');
    }

    // Continue with fetching participated challenge IDs
    const participatedChallengeIds = (
      await Player.findAll({
        where: { UserID: userId },
        attributes: ['ChallengeID'],
      })
    ).map(participation => participation.ChallengeID);

    // Define variables for past and active challenges count initialization
    let pastChallengesCount = 0;
    let currentActiveChallengesCount = 0;
    let currentStaked = 0;

    if (participatedChallengeIds.length) {
      // Past Challenges Count
      pastChallengesCount = await Challenge.count({
        where: {
          ChallengeID: { [Op.in]: participatedChallengeIds },
          EndDate: { [Op.lt]: new Date() },
        },
      });

      // Fetch Current Active Challenges and calculate total staked
      const currentActiveChallenges = await Challenge.findAll({
        where: {
          ChallengeID: { [Op.in]: participatedChallengeIds },
          StartDate: { [Op.lte]: new Date() },
          EndDate: { [Op.gt]: new Date() },
        },
        attributes: ['Wager'],
      });

      currentActiveChallengesCount = currentActiveChallenges.length;
      currentStaked = currentActiveChallenges.reduce((sum, challenge) => sum + challenge.Wager, 0);
    }

    const totalRewardsWon = (await Transaction.sum('Amount', { where: { UserID: userId } })) || 0;

    logger.info(`[UserService] User details data fetched successfully for ID: ${userId}`);
    return {
      UserID: userId,
      UserName: user.UserName,
      UserEmail: user.Email,
      WalletAddress: user.WalletAddress?.WalletAddress || 'N/A', // Handle case where WalletAddress might be null
      TotalRewardsWon: totalRewardsWon,
      Credits: user.Credits,
      PastChallenges: pastChallengesCount,
      CurrentActiveChallenges: currentActiveChallengesCount,
      CurrentStaked: currentStaked,
    };
  } catch (error) {
    logger.error(`[UserService] Error fetching user details data for ID: ${userId}: ${error}`);
    throw error;
  }
};

module.exports = {
  getUserCurrentStandings,
  getUserProgressData,
  getUserDetailsData,
};
