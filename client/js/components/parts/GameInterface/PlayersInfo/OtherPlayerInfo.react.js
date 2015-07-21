'use strict';

/*
 * React component containing information about one other player
 */

import React from 'react';
import { Group, Text } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class OtherPlayerInfo extends MoreartyComponent {
	/**
	 * @return {React.Element} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		var color = binding.get('color') || 'white';

		return (
				<Group x={this.props.x} y={this.props.height * this.props.index}>
					<Rectangle
							width={this.props.width}
							height={this.props.height}
							stroke='black'
							fill={color}
							/>
					<Group x={10} y={10}>
						<Text ref="name" fill="black" font={{ 'font-size': '12px' }}>{binding.get('name')}</Text>
						<Text ref="cards" y={20} fill="black" font={{ 'font-size': '12px' }}>
							{'Cards: ' + binding.get('nbOfCards')}</Text>
					</Group>
				</Group>
		);
	}
}

OtherPlayerInfo.propTypes = {
	index: React.PropTypes.number.isRequired
};

OtherPlayerInfo.defaultProps = {
	width: 100,
	height: 60
};

OtherPlayerInfo.displayName = 'OtherPlayerInfo';