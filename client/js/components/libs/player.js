var players = new Map();

export default class Player {
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
}

Player.createPlayer = function() {
  var player = new Player(...arguments);
  players.set(player.id, player);
  return player;
};

Player.getPlayer = (id) => {
  return players.get(parseInt(id, 10));
};

Player.getMap = () => {
  return players;
};

Player.deleteAll = () => {
  players.clear();
};