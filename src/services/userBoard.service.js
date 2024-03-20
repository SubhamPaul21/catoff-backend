const {
  Player,
  Challenge,
  Transaction,
  User,
  Game,
  // WalletAddress,
} = require('../models/index');
const { Op } = require('sequelize');
const logger = require('../utils/logger'); // Ensure this path is correct for your logger setup

// const getUserCurrentStandings = async (userId) => {
//   logger.debug(
//     `[UserBoardService] Fetching current standings for user ID: ${userId}`
//   );
//   try {
//     // Step 1: Fetch all player records for the given userId
//     const userChallenges = await Player.findAll({
//       where: { UserID: userId },
//       include: [
//         {
//           model: Challenge,
//           attributes: ['ChallengeID', 'ChallengeType'],
//         },
//       ],
//       attributes: ['ChallengeID'],
//     });

//     // Step 2: Extract ChallengeIDs
//     const challengeIds = userChallenges.map((uc) => uc.ChallengeID);

//     // Prepare the final results array
//     const results = [];

//     // Step 3: Fetch all player records for each ChallengeID and calculate ranks
//     for (const challengeId of challengeIds) {
//       const playersInChallenge = await Player.findAll({
//         where: { ChallengeID: challengeId },
//         include: [
//           {
//             model: Challenge,
//             attributes: ['ChallengeID', 'ChallengeType'],
//           },
//         ],
//         attributes: ['UserID', 'Value', 'ChallengeID'],
//         order: [['Value', 'DESC']],
//       });

//       // Calculate rank
//       const rankedPlayers = playersInChallenge.map((player, index) => ({
//         userId: player.UserID,
//         value: player.Value,
//         rank: index + 1, // Rank based on ordering by Value
//       }));

//       // Find the rank of the current user
//       const currentUserRank = rankedPlayers.find((rp) => rp.userId === userId);

//       if (currentUserRank) {
//         results.push({
//           challengeId: challengeId,
//           challengeType: playersInChallenge[0].Challenge.ChallengeType,
//           currentValue: currentUserRank.value,
//           rank: currentUserRank.rank,
//         });
//       }
//     }

//     // Convert results to the specified format
//     const formattedResults = results.reduce(
//       (acc, result, index) => ({
//         ...acc,
//         [index]: result,
//       }),
//       {}
//     );

//     logger.info(
//       `[UserBoardService] Current standings fetched successfully for user ID: ${userId}`
//     );
//     return formattedResults;
//   } catch (error) {
//     logger.error(
//       `[UserBoardService] Error fetching user standings for user ID: ${userId}: ${error}`
//     );
//     throw error;
//   }
// };

// const getUserCurrentStandings = async (userId) => {
//   logger.debug(
//     `[UserBoardService] Fetching current standings for user ID: ${userId}`
//   );
//   try {
//     const userChallenges = await Player.findAll({
//       where: { UserID: userId },
//       include: [
//         {
//           model: Challenge,
//           attributes: [
//             'ChallengeID',
//             'ChallengeName',
//             'ChallengeType',
//             'StartDate',
//             'EndDate',
//             'IsActive',
//             'Wager',
//             'Winners',
//           ],
//         },
//       ],
//       attributes: ['ChallengeID'],
//     });

//     const results = await Promise.all(
//       userChallenges.map(async ({ Challenge }) => {
//         const now = new Date();
//         const challengeStatus =
//           Challenge.IsActive &&
//           now >= Challenge.StartDate &&
//           now <= Challenge.EndDate
//             ? 'Active'
//             : now > Challenge.EndDate
//               ? 'Completed'
//               : 'Upcoming';

//         const allParticipants = await Player.findAll({
//           where: { ChallengeID: Challenge.ChallengeID },
//           order: [['Value', 'DESC']],
//           attributes: ['UserID', 'Value'],
//         });

//         // Calculate rank
//         const rank =
//           allParticipants.findIndex(
//             (participant) => participant.UserID === userId
//           ) + 1;
//         const currentUserParticipation = allParticipants.find(
//           (participant) => participant.UserID === userId
//         );
//         // Ensure Winners is an array and contains the userId
//         const isWinner =
//           Array.isArray(Challenge.Winners) &&
//           Challenge.Winners.includes(userId);
//         const adjustedWager = isWinner ? Challenge.Wager : -Challenge.Wager;

//         return {
//           challengeId: Challenge.ChallengeID,
//           challengeName: Challenge.ChallengeName,
//           challengeType: Challenge.ChallengeType,
//           challengeStatus,
//           startDate: Challenge.StartDate,
//           endDate: Challenge.EndDate,
//           wagerAmount:
//             challengeStatus === 'Completed' ? adjustedWager : Challenge.Wager,
//           currentValue: currentUserParticipation
//             ? currentUserParticipation.Value
//             : 0, // Assumes Value is stored in Player model
//           rank,
//         };
//       })
//     );

//     logger.info(
//       `[UserBoardService] Current standings fetched successfully for user ID: ${userId}`
//     );
//     return results;
//   } catch (error) {
//     logger.error(
//       `[UserBoardService] Error fetching user standings for user ID: ${userId}: ${error}`
//     );
//     throw error;
//   }
// };

const getUserCurrentStandings = async (userId) => {
  logger.debug(`[UserService] Fetching current standings for user ID: ${userId}`);
  try {
    const userChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Challenge,
          as: 'challenge', // Ensure the alias matches the association definition
          attributes: [
            'ChallengeID',
            'ChallengeName',
            'StartDate',
            'EndDate',
            'IsActive',
            'Wager',
            'Winner',
            'MaxParticipants',
            'Players',
            'Media',
            'Target',
          ],
          include: [{
            model: Game,
            as: 'game', // Ensure the alias matches the association definition
            attributes: ['GameName', 'ParticipationType', 'GameType', 'GameDescription'],
          }],
        },
      ],
      attributes: ['ChallengeID'],
    });

    const results = await Promise.all(userChallenges.map(async ({ challenge }) => {
      const now = new Date();
      const challengeStatus = challenge.IsActive && now >= challenge.StartDate && now <= challenge.EndDate
        ? 'Active'
        : now > challenge.EndDate
            ? 'Completed'
            : 'Upcoming';

      const allParticipants = await Player.findAll({
        where: { ChallengeID: challenge.ChallengeID },
        order: [['Value', 'DESC']],
        attributes: ['UserID', 'Value'],
      });

      const rank = allParticipants.findIndex(participant => participant.UserID === userId) + 1;
      const totalParticipants = allParticipants.length; // Total number of participants in the challenge
      const totalWager = challenge.Wager * totalParticipants;

      return {
        challengeId: challenge.ChallengeID,
        challengeName: challenge.ChallengeName,
        gameName: challenge.game.GameName, // Newly added Game details
        participationType: challenge.game.ParticipationType,
        gameType: challenge.game.GameType,
        gameDescription: challenge.game.GameDescription,
        challengeStatus,
        startDate: challenge.StartDate,
        endDate: challenge.EndDate,
        wagerAmount: totalWager, // Reflects total wager for consistency
        currentValue: totalWager, // Assuming it should reflect the total wager involved
        rank,
      };
    }));

    logger.info(`[UserService] Current standings fetched successfully for user ID: ${userId}`);
    return results;
  } catch (error) {
    logger.error(`[UserService] Error fetching user standings for user ID: ${userId}: ${error}`);
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
  logger.debug(`[UserBoardService] Fetching user progress data for ID: ${userId}, Period: ${period}`);
  let dateFrom;
  let aggregateByInterval = false;

  switch (period) {
    case '30days':
      dateFrom = new Date(new Date().setDate(new Date().getDate() - 30));
      break;
    case '24hours':
      dateFrom = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      aggregateByInterval = true; // Aggregate by the nearest 15-minute interval
      break;
    case 'all':
      dateFrom = new Date(0); // Start from the Unix Epoch (1970-01-01)
      break;
    default:
      logger.error('[UserBoardService] Invalid period specified for user progress data');
      throw new Error('Invalid period specified');
  }

  try {
    // Fetch transactions where the user is either the sender or the receiver
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [{ To: userId }, { From: userId }],
        Timestamp: { [Op.gte]: dateFrom },
      },
      order: [['Timestamp', 'ASC']],
      attributes: ['Amount', 'Timestamp', 'To', 'From'],
    });

    // Aggregate data for graph, considering credits and debits
    const aggregatedData = transactions.reduce((acc, { Amount, Timestamp, To, From }) => {
      const key = aggregateByInterval ? formatToNearest15Min(Timestamp) : Timestamp.toISOString().split('T')[0];
      if (!acc[key]) acc[key] = { credits: 0, debits: 0 };

      // If the user is the receiver, it's a credit; if the sender, it's a debit
      if (To === userId) {
        acc[key].credits += Amount;
      } else if (From === userId) {
        acc[key].debits -= Amount; // Assuming you want to show debits as negative
      }

      return acc;
    }, {});

    const creditsGraph = Object.entries(aggregatedData).map(([time, { credits, debits }]) => ({
      time,
      balanceChange: credits + debits, // Combine credits and debits for the net balance change
    }));

    logger.info(`[UserBoardService] User progress data fetched successfully for ID: ${userId}`);
    return { creditsGraph };
  } catch (error) {
    logger.error(`[UserBoardService] Error fetching user progress data for ID: ${userId}: ${error}`);
    throw error;
  }
};


const getUserDetailsData = async (userId) => {
  logger.debug(`[UserBoardService] Fetching user details data for ID: ${userId}`);
  try {
    // Fetch user basic details including WalletAddress directly
    const user = await User.findOne({
      where: { UserID: userId },
      attributes: [
        'UserID',
        'Email',
        'UserName',
        'WalletAddress',
        'Credits',
        'ProfilePicture',
      ],
    });

    if (!user) {
      logger.info(`[UserBoardService] User not found for ID: ${userId}`);
      throw new Error('User not found');
    }

    // Continue with fetching participated challenge IDs
    const participatedChallengeIds = (
      await Player.findAll({
        where: { UserID: userId },
        attributes: ['ChallengeID'],
      })
    ).map((participation) => participation.ChallengeID);

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
      currentStaked = currentActiveChallenges.reduce(
        (sum, challenge) => sum + challenge.Wager,
        0
      );
    }

    const totalRewardsWon =
      (await Transaction.sum('Amount', { where: { UserID: userId } })) || 0;

    logger.info(
      `[UserBoardService] User details data fetched successfully for ID: ${userId}`
    );
    return {
      UserID: userId,
      UserName: user.UserName,
      UserEmail: user.Email,
      WalletAddress: user.WalletAddress || 'N/A', // Now directly accessed
      Credits: user.Credits,
      ProfilePicture: user.ProfilePicture, // Now directly accessed
      PastChallenges: pastChallengesCount,
      CurrentActiveChallenges: currentActiveChallengesCount,
      CurrentStaked: currentStaked,
      TotalRewardsWon: totalRewardsWon,
    };
  } catch (error) {
    logger.error(
      `[UserBoardService] Error fetching user details data for ID: ${userId}: ${error}`
    );
    throw error;
  }
};

module.exports = {
  getUserCurrentStandings,
  getUserProgressData,
  getUserDetailsData,
};
