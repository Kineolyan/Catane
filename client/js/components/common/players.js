var players = new Map();
var manager;

class Player {
  constructor(id, name, color) {

    this._id = parseInt(id, 10);
    this._color = color;
    this._name = name;

    this._cards = [];

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

  get cards() {
    return this._cards;
  }

  set name(val) {
    this._name = val;
  }

  set id(val) {
    this._id = val;
  }

  set color(val) {
    this._color = val;
  }

  isMe() {
    return this._id === manager.myId;
  }

  giveCards(cards) {
    for(let key in cards) {
      if(cards.hasOwnProperty(key)) {
        for(let i = 0; i < cards[key]; i += 1) {
          this._cards.push(key);
        }
      }
    }
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
  },

  deleteOthers() {
    var me = this.getMe();
    players.clear();
    players.set(me.id, me);
  },

  createFromJS(obj) {
    let player = new Player();
    players.set(obj.id, player);
    return Object.assign(player, obj);
  },

  toJS() {
    var p = [];

    players.forEach(e => {
      p.push(e);
    });

    return p;
  },

  loadAllFromJS(players) {
    this.deleteAll();
    players.forEach(elem => this.createFromJS(elem));
  }
};

export default manager;