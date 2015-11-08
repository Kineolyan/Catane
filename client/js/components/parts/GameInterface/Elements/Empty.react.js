import React from 'react';

import Rectangle from 'react-art/shapes/rectangle';

export default class Empty extends React.Component {

	render() {
		return <Rectangle x={this.props.x} y={this.props.y}
                       height={0} width={0}
						           stroke='black' fill="black" />;
	}
}

Empty.defaultProps = {
	x: 0,
	y: 0
};

Empty.displayName = 'Empty';
