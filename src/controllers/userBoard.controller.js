const {
  getUserCurrentStandings,
  getUserProgressData,
} = require('../services/userBoard.service');

exports.getUserCurrentTable = async (req, res) => {
  try {
    const userID = req.UserID;
    const standings = await getUserCurrentStandings(userID);

    res.json(standings);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user standings', error: error.message });
  }
};

exports.getUserProgressGraph = async (req, res) => {
  try {
    const userID = req.UserID; // Assuming your auth middleware adds the user object to req
    const { period } = req.params; // '30days', '24hours', or 'all'
    const progressData = await getUserProgressData(userID, period);

    res.json(progressData);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user progress', error: error.message });
  }
};
