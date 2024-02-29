const {
  createGame,
  getGame,
  updateGame,
  deleteGame,
} = require('../services/game.service');

const createGameHandler = async (req, res) => {
  try {
    const game = await createGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating game', error: error.message });
  }
};

const getGameHandler = async (req, res) => {
  try {
    const game = await getGame(req.params.ID);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving game', error: error.message });
  }
};

const updateGameHandler = async (req, res) => {
  try {
    const updated = await updateGame(req.params.ID, req.body);
    if (!updated) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating game', error: error.message });
  }
};

const deleteGameHandler = async (req, res) => {
  try {
    const deleted = await deleteGame(req.params.ID);
    if (!deleted) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting game', error: error.message });
  }
};

module.exports = {
  createGameHandler,
  getGameHandler,
  updateGameHandler,
  deleteGameHandler,
};
