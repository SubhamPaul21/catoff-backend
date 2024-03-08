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
    return makeResponse(res, 201, true,"challenge created successful", challenge)
  } catch (error) {
    return makeResponse(res, 500, false,"error retrieving challenge", null)
  }
};

const getChallengeHandler = async (req, res) => {
  try {
    const challenge = await getChallenge(req.params.ID);
    if (!challenge)
      return makeResponse(res, 404, false,"challenge not found", null)
    return makeResponse(res, 200, true,"queryy successful", challenge)
  } catch (error) {
      return makeResponse(res, 500, false,"error retrieving challenge", null)
  }
};

const updateChallengeHandler = async (req, res) => {
  try {
    const [updated] = await updateChallenge(req.params.ID, req.body);
    if (!updated)
      return makeResponse(res, 404, false,"challenge not found", null)
    return makeResponse(res, 200, true,"challenge updated succesffully", updated)
  } catch (error) {
      return makeResponse(res, 500, false,"error retrieving challenge", null)
  }
};

const deleteChallengeHandler = async (req, res) => {
  try {
    const deleted = await deleteChallenge(req.params.ID);
    if (!deleted)
      return makeResponse(res, 404, false, "challenge not found", null)
      makeResponse(res, 200, true, "challenge deleted successfully", deleted)
  } catch (error) {
    return makeResponse(res, 500, false,"error retrieving challenge", null)
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
