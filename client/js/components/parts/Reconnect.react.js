
import React from 'react';
import Socket from '../libs/socket.js';
import reactBootstrap from 'react-bootstrap';

import Globals from '../libs/globals';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;

export default class Reconnect extends React.Component {
	constructor() {
		super(...arguments);
		this.localStorage = window.localStorage;
		this.loadPreviousSession();
		this.storeSession();
		this.state = {display: this.hasPreviousSession()};
	}

	hasPreviousSession() {
		return this.previousSession.id === this.props.init.id;
	}

	loadPreviousSession() {
		this.previousSession = JSON.parse(this.localStorage.server || '{}');
	}

	storeSession() {
		this.localStorage.server = JSON.stringify({
			id: this.props.init.id,
			sid: this.props.init.sid
		});
	}

	render() {
		var reconnectBtn;

		if (this.state.display) {
			reconnectBtn = (
				<Button onClick={this.reconnect.bind(this)}>
					<Glyphicon glyph={"repeat"}/>
				</Button>
			);
		}

		return (<div id={"reconnect"}>
			{ reconnectBtn }
		</div>);
	}

	reconnect() {
		Socket.emit(Globals.socket.reconnect, this.previousSession.sid);
		this.setState({display: false});
	}
}


Reconnect.displayName = 'Reconnect';