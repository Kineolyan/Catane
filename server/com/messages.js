export const messages = {
	ok: function(socket, channel) {
		socket.emit(channel, { success: true });
	},
	ko: function(socket, channel, reason) {
		socket.emit(channel, { success: false, message: reason });
	}
};