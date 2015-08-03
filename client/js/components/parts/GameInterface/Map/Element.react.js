import React from 'react';
import { Group } from 'react-art';

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

/**
 * Basic element of the map, handling basic mouse interaction
 * Abstrac methods:
 *  - React.Element doRender(): returning the sub rendering
 */
export default class MapElement extends MoreartyComponent {
	constructor() {
		super();

		this.state = { mouseIn: false };
	}

  get x() {
    return this.getDefaultBinding().get('x');
  }

  get y() {
    return this.getDefaultBinding().get('y');
  }

	isSelectable() {
		return this.getDefaultBinding().get('selectable');
	}

	units(value) {
		var unitSize = 60; // TODO use geometry binding
		return value * unitSize;
	}

	render() {
		return (<Group x={this.units(this.x)} y={this.units(this.y)}
			onMouseOver={this.mouseEnter.bind(this)}
			onMouseOut={this.mouseLeave.bind(this)}
			{...this.actions}>
			{this.doRender()}
		</Group>);
	}

	get actions() {
		return {};
	}

	mouseEnter() {
		if (this.isSelectable()) {
			window.document.body.style.cursor = 'pointer';
			this.setState({ mouseIn: true });
		}
	}

	mouseLeave() {
		window.document.body.style.cursor = 'auto';
		this.setState({ mouseIn: false });
	}
}