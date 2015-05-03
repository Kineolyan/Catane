var players = new Map();
var manager;

class Player {
  constructor(id, name, color) {

    this._id = parseInt(id, 10);
    this._color = color;
    this._name = name;
  }

  get color() {
    return this._color;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  isMe() {
    return this._id === manager.myId;
  }
}

manager = {
  myId: 0,
  createPlayer() {
    var player = new Player(...arguments);
    players.set(player.id, player);
    return player;
  },

  getPlayer(id) {
    return players.get(parseInt(id, 10));
  },

  getMap() {
    return players;
  },

  deleteAll() {
    players.clear();
  },

  getMe() {
    return this.getPlayer(this.myId);
  }
};

export default manager;