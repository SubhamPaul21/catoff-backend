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
const { ParticipationTypeRev, GameType } = require('../constants/constants');

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
  logger.debug(
    `[UserService] Fetching current standings for user ID: ${userId}`
  );
  try {
    const userChallenges = await Player.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Challenge,
          as: 'challenge',
          attributes: [
            'ChallengeID',
            'ChallengeName',
            'StartDate',
            'EndDate',
            'IsActive',
            'Wager',
            'Winner',
            'MaxParticipants',
            'Media',
            'Target',
          ],
          include: [
            {
              model: Game,
              as: 'game',
              attributes: [
                'GameName',
                'ParticipationType',
                'GameType',
                'GameDescription',
              ],
            },
          ],
        },
      ],
      attributes: ['ChallengeID'],
    });

    const results = await Promise.all(
      userChallenges.map(async ({ challenge }) => {
        const now = new Date().getTime();
        const challengeStatus =
          challenge.IsActive &&
          now >= Number(challenge.StartDate) &&
          now <= Number(challenge.EndDate)
            ? 'Active'
            : now > Number(challenge.EndDate)
              ? 'Completed'
              : 'Upcoming';

        const allParticipants = await Player.findAll({
          where: { ChallengeID: challenge.ChallengeID },
          order: [['Value', 'DESC']],
          attributes: ['UserID', 'Value'],
        });

        const rank =
          allParticipants.findIndex(
            (participant) => participant.UserID === userId
          ) + 1;
        const totalParticipants = allParticipants.length;
        const totalWager = challenge.Wager * totalParticipants;

        return {
          ChallengeID: challenge.ChallengeID,
          ChallengeName: challenge.ChallengeName,
          GameName: challenge.game.GameName,
          ParticipationType:
            ParticipationTypeRev[challenge.game.ParticipationType],
          GameType: GameType[challenge.game.GameType],
          GameDescription: challenge.game.GameDescription,
          ChallengeStatus: challengeStatus,
          StartDate: challenge.StartDate,
          EndDate: challenge.EndDate,
          WagerStaked: challenge.Wager,
          TotalWagerStaked: totalWager,
          Rank: rank,
        };
      })
    );

    logger.info(
      `[UserService] Current standings fetched successfully for user ID: ${userId}`
    );
    return results;
  } catch (error) {
    logger.error(
      `[UserService] Error fetching user standings for user ID: ${userId}: ${error}`
    );
    throw error;
  }
};

// Helper function to format date as YYYY-MM-DD HH:MM where MM is the nearest 15-minute block
const formatToNearest15Min = (timestamp) => {
  const date = new Date(Number(timestamp)); // Convert BigInt to Number and then to Date
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const nearest15Min = minutes - (minutes % 15);
  return `${date.toISOString().split('T')[0]} ${String(hours).padStart(2, '0')}:${String(nearest15Min).padStart(2, '0')}`;
};

const getUserProgressData = async (userId, period) => {
  logger.debug(
    `[UserBoardService] Fetching user progress data for ID: ${userId}, Period: ${period}`
  );
  let dateFrom;
  let aggregateByInterval = false;

  switch (period) {
    case '30days':
      // Convert to BigInt after subtracting days
      dateFrom = BigInt(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '24hours':
      // Convert to BigInt after subtracting hours
      dateFrom = BigInt(new Date().getTime() - 24 * 60 * 60 * 1000);
      aggregateByInterval = true; // Aggregate by the nearest 15-minute interval
      break;
    case 'all':
      // Start from the Unix Epoch (1970-01-01), represented as BigInt
      dateFrom = BigInt(0);
      break;
    default:
      logger.error(
        '[UserBoardService] Invalid period specified for user progress data'
      );
      throw new Error('Invalid period specified');
  }

  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [{ To: userId }, { From: userId }],
        Timestamp: { [Op.gte]: dateFrom },
      },
      order: [['Timestamp', 'ASC']],
      attributes: ['CreditAmount', 'Timestamp', 'To', 'From'],
    });

    const aggregatedData = transactions.reduce(
      (acc, { CreditAmount, Timestamp, To, From }) => {
        const timestampDate = new Date(Number(Timestamp)); // Convert BigInt to Number then to Date
        const key = aggregateByInterval
          ? formatToNearest15Min(Timestamp)
          : `${timestampDate.getFullYear()}-${String(timestampDate.getMonth() + 1).padStart(2, '0')}-${String(timestampDate.getDate()).padStart(2, '0')}`;

        if (!acc[key]) acc[key] = { credits: 0, debits: 0 };

        if (To === userId) {
          acc[key].credits += CreditAmount;
        } else if (From === userId) {
          acc[key].debits -= CreditAmount; // Debits shown as negative
        }

        return acc;
      },
      {}
    );

    const creditsGraph = Object.entries(aggregatedData).map(
      ([time, { credits, debits }]) => ({
        time,
        balanceChange: credits + debits,
      })
    );

    logger.info(
      `[UserBoardService] User progress data fetched successfully for ID: ${userId}`
    );
    return { creditsGraph };
  } catch (error) {
    logger.error(
      `[UserBoardService] Error fetching user progress data for ID: ${userId}: ${error}`
    );
    throw error;
  }
};

const getUserDetailsData = async (userId) => {
  logger.debug(
    `[UserBoardService] Fetching user details data for ID: ${userId}`
  );
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
          EndDate: { [Op.lt]: new Date().getTime() },
        },
      });

      // Fetch Current Active Challenges and calculate total staked
      const currentActiveChallenges = await Challenge.findAll({
        where: {
          ChallengeID: { [Op.in]: participatedChallengeIds },
          StartDate: { [Op.lte]: new Date().getTime() },
          EndDate: { [Op.gt]: new Date().getTime() },
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
      (await Transaction.sum('CreditAmount', { where: { UserID: userId } })) ||
      0;

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
