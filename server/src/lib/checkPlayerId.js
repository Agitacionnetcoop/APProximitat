const getDatabase = require('../db/getDatabase')

const saveOrUpdatePlayerId = async (userId, playerId) => {
  const db = new getDatabase();
  const existingPlayerId = await db.getPlayerId(userId);

  try {
    if (existingPlayerId) {
      if (existingPlayerId !== playerId) {
        await db.updatePlayerId(userId, playerId);
      }
    } else {
      await db.savePlayerId(userId, playerId);
    }

  } catch (error) {
    console.log('Error', error);
    return null;
  }
}

module.exports = saveOrUpdatePlayerId;