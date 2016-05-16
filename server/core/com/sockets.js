import { logger } from 'libs/log/logger';

export class Reply {
	constructor(player) {
		this._player = player;
		this._actions = [];
	}

	processMessage(defaultChannel, channel, message) {
		if (message === undefined) {
			message = channel;
			channel = defaultChannel;
		}

		// Add success flag
		message._success = true;

		return [channel, message];
	}

	emit(channel, message) {
		this._actions.push(defaultChannel => {
			const [c, m] = this.processMessage(defaultChannel, channel, message);
			this._player.emit(c, m);
		});
		return this;
	}

	others(channel, message) {
		this._actions.push(defaultChannel => {
			const [c, m] = this.processMessage(defaultChannel, channel, message);
			this._player.game.emit(this._player, c, m);
		});
		return this;
	}

	all(channel, message) {
		this._actions.push(defaultChannel => {
			const [c, m] = this.processMessage(defaultChannel, channel, message);
			this._player.game.emit(c, m);
		});
		return this;
	}

	execute(channel) {
		for (let action of this._actions) { action(channel); }
	}
}

export default class Socket {
	constructor(id, socket, world) {
		this._id = id;
		this._socket = socket;
		this._world = world;
	}

	get id() {
		return this._id;
	}

	on(channel, cbk) {
		var self = this;
		this._socket.on(channel, function() {
			try {
				var response = cbk.apply(undefined, arguments);
				if (response !== undefined) {
					if (response instanceof Reply) {
						response.execute(channel);
					} else if (response instanceof Object) {
						response._success = true;
						self.emit(channel, response);
					} else {
						self.emit(channel, { _success: response === true });
					}
				}
			} catch (e) {
				logger.error(`#${channel} > {${e.name}} ${e.message}\n${e.stack}`);

				self.emit(channel, {
					_success: false,
					message: `[${e.name}] ${e.message}`,
					stacktrace: e.stack
				});
			}
		});
	}

	emit(channel, message) {
		this._socket.emit(channel, message);
	}

	broadcast(channel, message) {
		this._socket.broadcast.emit(channel, message);
	}

	all(channel, message) {
		this._world.emit(channel, message);
	}
}
