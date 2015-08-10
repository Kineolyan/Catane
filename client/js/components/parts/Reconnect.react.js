import { gameManager } from 'client/js/components/listener/listener';
import LocalStorage from 'client/js/components/libs/localStorage';

import React from 'react';
import reactBootstrap from 'react-bootstrap';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;

export default class Reconnect extends React.Component {
	constructor() {
		super(...arguments);
		this.localStorage = new LocalStorage();
		this.loadPreviousSession();
		this.state = { display: this.hasPreviousSession() };
	}

	hasPreviousSession() {
		return this.previousSession.id === this.props.server.id;
	}

	loadPreviousSession() {
		this.previousSession = this.localStorage.get('server') || {};
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
		gameManager().reconnect(this.previousSession.sid);
		this.setState({ display: false });
	}
}


Reconnect.displayName = 'Reconnect';