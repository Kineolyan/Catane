export default class Socket {
	constructor(socket) {
		this._socket = socket;
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
}