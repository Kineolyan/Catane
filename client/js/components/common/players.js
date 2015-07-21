import Immutable from 'immutable';

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

export class PlayersBinding {

  constructor(binding) {
    this._binding = binding;
  }

	static from(binding) {
		return new PlayersBinding(binding.get('players'));
	}

	save(binding) {
		return binding.set('players', this._binding);
	}

  get binding() {
    return this._binding;
  }

	setIPlayer(id, ...args) {
		var player = PlayersBinding.createPlayer(id, ...args);
		player.me = true;
		this.set(id, player);
	}

	setPlayer(id, ...args) {
		var player = PlayersBinding.createPlayer(id, ...args);
		this.set(id, player);
	}

	updatePlayer(id, values) {
		var player = this.getPlayer(id);
		if (player !== null) {
			this._binding = this._binding.update(
					this._binding.findIndex(player => player.get('id') === id),
					player => player.merge(values)
			);
		} else {
			throw new Error(`Player ${id} does not exist`);
		}
	}

	static createPlayer(id, name, color, nbCards) {
		return {
			id: id, name: name,
			color: color,
			nbOfCards: nbCards
		};
	}

	set(id, player) {
		var pIdx = null;
		this._binding.forEach((p, i) => {
			if (id === p.get('id')) {
				pIdx = i;
				return false;
			} else {
				return true;
			}
		});

		if (pIdx != null) {
			this._binding = this._binding.set(pIdx, Immutable.fromJS(player));
		} else {
			this._binding = this._binding.push(Immutable.fromJS(player));
		}
	}

	getPlayer(id) {
		var result = this._binding.filter(player => player.get('id') === id);
		return !result.isEmpty() ? result.first() : null;
	}

	getMe() {
		return this._binding.filter(PlayersBinding.isMe).first();
	}

  deleteOthers() {
    this._binding = this._binding.filter(PlayersBinding.isMe);
  }

	deleteAll() {
		this._binding = this._binding.clear();
	}

  static isMe(playerBinding) {
    return playerBinding.get('me') === true;
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
    let player = new Player(obj.id, obj.name);
    players.set(obj.id, player);
    player.giveCards(obj.cards);

    return player;
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