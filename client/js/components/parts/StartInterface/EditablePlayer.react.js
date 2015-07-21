'use strict';

/*
 React component containing the whole game interface
 */

import Globals from 'client/js/components/libs/globals';
import Socket from 'client/js/components/libs/socket';

import React from 'react'; // eslint-disable-line no-unused-vars
import reactBoostrap from 'react-bootstrap';

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

import { PlayersBinding } from 'client/js/components/common/players';

var Button = reactBoostrap.Button;
var Glyphicon = reactBoostrap.Glyphicon;

export default class EditablePlayer extends MoreartyComponent {

	/**
	 * Render the player interface
	 * @return {React.Element} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		var players = new PlayersBinding(binding.get('players'));
		var me = players.getMe();

		var btn = (<Button bsSize="small" className={'pull-right'} ref="modify" onClick={this.triggerChangeName.bind(this)}>
			Change <Glyphicon glyph="pencil"/>
		</Button>);

		var room;
		if (binding.get('start.gameChosen.id')) {
			room = <span>/ Room #{binding.get('start.gameChosen.id')}</span>;
		}

		return (
				<div className={'player clearfix'}>
					<div className={'name pull-left'}>
						{me.get('name')} {room}
					</div>
					{btn}
				</div>
		);
	}

	/**
	 * Ask to change the name
	 */
	triggerChangeName() {
		var name = window.prompt('What\'s your name ?');

		Socket.emit(Globals.socket.playerNickname, name);
	}

}

EditablePlayer.displayName = 'EditablePlayer';
