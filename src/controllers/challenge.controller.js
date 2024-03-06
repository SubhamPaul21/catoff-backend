// challengeController.js
const {
  createChallenge,
  getChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getOngoingChallenges,
} = require('../services/challenge.service');
let { makeResponse } = require('../utils/responseMaker');

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
    const challenge = await getChallenge(req.params.ID);
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
    const [updated] = await updateChallenge(req.params.ID, req.body);
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
    const deleted = await deleteChallenge(req.params.ID);
    if (!deleted)
      return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting challenge', error: error.message });
  }
};

const searchChallengeHandler = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const challenges = await searchChallenge(searchTerm);
    return makeResponse(res, 200, true, 'search successful', challenges);
  } catch (e) {
    return makeResponse(res, e.status, false, 'search failed', null);
  }
};

const getOnGoingChallengesHandler = async (req, res) => {
  try {
    const type = req.params.type;
    const page = req.query.page;
    const challenges = await getOngoingChallenges(type, page);
    return makeResponse(res, 200, true, 'query successful', challenges);
  } catch (e) {
    console.log(e);
    return makeResponse(res, 500, false, 'unable to retrieve', null);
  }
};

module.exports = {
  createChallengeHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
  searchChallengeHandler,
  getOnGoingChallengesHandler,
};
