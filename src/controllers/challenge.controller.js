// challengeController.js
const {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
} = require('../services/challenge.service');

const createChallengeHandler = async (req, res) => {
  try {
    const challenge = await createChallenge(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating challenge', error: error.message });
  }
};

const getChallengeHandler = async (req, res) => {
  try {
    const challenge = await getChallenge(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving challenge', error: error.message });
  }
};

const updateChallengeHandler = async (req, res) => {
  try {
    const [updated] = await updateChallenge(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating challenge', error: error.message });
  }
};

const deleteChallengeHandler = async (req, res) => {
  try {
    const deleted = await deleteChallenge(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting challenge', error: error.message });
  }
};

module.exports = {
  createChallengeHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
};
