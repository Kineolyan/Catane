import { Group, Text } from 'react-art';
import Circle from 'react-art/shapes/circle';

import React from 'react'; // eslint-disable-line no-unused-vars
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class PlayerInfo extends MoreartyComponent {

	/**
	 * Render the whole map of the game
	 * @return {Object} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		var color = binding.get('color') || 'white';
		var name = binding.get('name');

		return (
				<Group x={this.props.x} y={this.props.height * this.props.index}>
					<Circle x={10} y={this.props.height / 2 - 5}
					        radius={10} fill={color} stroke="black"/>
					<Text ref="name" x={25} y={this.props.height / 2 - 10}
					      fill="black" font={{ 'font-size': '12px' }}>{name}</Text>
				</Group>
		);
	}
}

PlayerInfo.defaultProps = {
	x: 0,
	width: 100,
	height: 60
};

PlayerInfo.displayName = 'PlayerInfo';