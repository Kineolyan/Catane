export const messages = {
	ok: function(socket, channel) {
		socket.emit(channel, { _success: true });
	},
	ko: function(socket, channel, reason) {
		socket.emit(channel, { _success: false, message: reason });
	}
};