// src/controllers/player.controller.js
const {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayersOfChallenge
} = require('../services/player.service');
let { makeResponse } = require('../utils/responseMaker');

const createPlayerHandler = async (req, res) => {
  try {
    const player = await createPlayer(req.body);
    res.status(201).json(player);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating player', error: error.message });
  }
};

const getPlayerHandler = async (req, res) => {
  try {
    const player = await getPlayer(req.params.ID);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving player', error: error.message });
  }
};

const updatePlayerHandler = async (req, res) => {
  try {
    const updated = await updatePlayer(req.params.ID, req.body);
    if (!updated) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating player', error: error.message });
  }
};

const deletePlayerHandler = async (req, res) => {
  try {
    const deleted = await deletePlayer(req.params.ID);
    if (!deleted) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting player', error: error.message });
  }
};

const getAllPlayersOfChallengeHandler = async(req,res)=>{
  try{
    const players = await getAllPlayersOfChallenge(req.params.ID);
    return makeResponse(res,200, true, "players fetched successful", players);
  }catch(e){
    return makeResponse(res, 500, false, "unable to retrieve", null);
  }
}

module.exports = {
  createPlayerHandler,
  getPlayerHandler,
  updatePlayerHandler,
  deletePlayerHandler,
  getAllPlayersOfChallengeHandler,
};
