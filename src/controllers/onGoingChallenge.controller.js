const playerService = require('../services/onGoingChallenge.service');

exports.getOngoingChallengesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ongoingChallenges = await playerService.getOngoingChallengesByUserId(userId);
    res.status(200).json(ongoingChallenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};