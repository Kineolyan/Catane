/**
 * Class mocking a socket from Socket.IO.
 */
export class MockSocketIO {
	constructor() {
		this._messages = {};
		this._channels = {};
	}

	get channels() {
		return Object.keys(this._channels);
	}

	/**
	 * Records all listened channels and their respectives actions.
	 * @param  {String} channel channel to listen to
	 * @param  {Function} cbk action to perform
	 */
	on(channel, cbk) {
		this._channels[channel] = cbk;
	}

	/**
	 * Emits a message on the channel
	 * @param  {String} channel name of the channel
	 * @param  {Object} message content of the message
	 */
	emit(channel, message) {
		this._messages[channel] = this._messages[channel] || [];
		/* Copy the message to avoid side effects due to the absence of real comm.
		 * This prevents updates on the stored message. */
		var copy = message !== undefined ? JSON.parse(JSON.stringify(message)) : null;
		this._messages[channel].push(copy);
	}

	/**
	 * Simulates the reception of a message on a given channel.
	 * This will call the registered callback if any or throw.
	 * @param  {String} channel name of the channel
	 * @param  {Object?} message content to receive
	 * @return {Object} last message received on the channel
	 */
	receive(channel, message) {
		var cbk = this._channels[channel];
		if (cbk) {
			cbk(message);

			return this.lastMessage(channel);
		} else {
			throw 'No listener for channel ' + channel;
		}
	}

	/**
	 * Gets if the socket is listening for a given channel.
	 * @param  {String} channel name of the channel to test
	 * @return {Boolean} true if listening, false otherwise
	 */
	isListening(channel) {
		return channel !== undefined
			&& channel !== null
			&& (channel in this._channels);
	}

	/**
	 * Gets all the messages of a channel;
	 * @param  {String} channel the channel to fetch
	 * @return {Array<Object>} received messages (null values for empty messages)
	 */
	messages(channel) {
		return this._messages[channel] || [];
	}

	/**
	 * Gets the last message of a channel
	 * @param  {String} channel the channel to fetch
	 * @return {Object} last message received on the channel (null if the message was empty)
	 *  or undefined if there are no messages.
	 */
	lastMessage(channel) {
		var messages = this.messages(channel);

		return messages[messages.length - 1];
	}
}