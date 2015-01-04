import Socket from './sockets';

/**
 * Class mocking a socket from Socket.IO.
 */
export class MockSocket {
	constructor() {
		this._messages = {};
		this._channels = {};
	}

	/**
	 * Records all listened channels and their respectives actions.
	 * @param  {String} channel to listen to
	 * @param  {Function} action to perform
	 */
	on(channel, cbk) {
		this._channels[channel] = cbk;
	}

	/**
	 * Emits a message on the channel
	 * @param  {String} channel
	 * @param  {Object} message
	 */
	emit(channel, message) {
		this._messages[channel] = this._messages[channel] || [];
		this._messages[channel].push(message);
	}

	/**
	 * Simulates the reception of a message on a given channel.
	 * This will call the registered callback if any or throw.
	 * @param  {String} channel
	 * @param  {Object} message
	 */
	receive(channel, message) {
		var cbk = this._channels[channel];
		if (cbk) {
			cbk(message);
		} else {
			throw 'No listener for channel ' + channel;
		}
	}

	/**
	 * Gets if the socket is listening for a given channel.
	 * @param  {String} channel to test
	 * @return {Boolean} true if listening, false otherwise
	 */
	isListening(channel) {
		return channel in this._channels;
	}

	/**
	 * Gets all the messages of a channel;
	 * @param  {String} channel
	 * @return {Array<Object>} received messages
	 */
	messages(channel) {
		return this._messages[channel] || [];
	}

	/**
	 * Gets the last message of a channel
	 * @param  {String} channel
	 * @return {Array<Object>} received messages
	 */
	lastMessage(channel) {
		var messages = this.messages(channel);

		return messages[messages.length - 1];
	}

	toSocket() {
		return new Socket(this);
	}
}