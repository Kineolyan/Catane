export default class Socket {
	constructor(socket, world) {
		this._socket = socket;
		this._world = world;
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
					message: `[${e.name}] ${e.message}`
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