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
		var me = this;
		this._socket.on(channel, function() {
			try {
				var response = cbk.apply(undefined, arguments);
				if (response !== undefined) {
					if (response instanceof Object) {
						response._success = true;
						me.emit(channel, response);
					} else {
						me.emit(channel, { _success: response === true });
					}
				}
			} catch (e) {
				me.emit(channel, {
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