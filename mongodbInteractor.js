const Mongo = require('mongodb');

class MongodbInteractor {
  constructor(mongodbURL) {
    this.client = new Mongo.MongoClient(mongodbURL, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      console.log('connected to mongodb');
      this.db = this.client.db('CamelUp_DB');
      this.games = this.db.collection('games');
    });
    
  }

  getGame(guildId) {
    return this.games.findOne({ guildId: guildId });
  }
  
  upsertGame(game, guildId) {
    const query = { guildId: guildId };
    const update = { $set: { game: game } };
    const options = { upsert: true };
    return this.games.updateOne(query, update, options);
  }

  deleteGame(guildId) {
    return this.games.deleteOne({ guildId: guildId });
  }
}

module.exports = { MongodbInteractor };