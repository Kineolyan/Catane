import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react.js';
import React from 'react'; // eslint-disable-line no-unused-vars

import { gameManager } from 'client/js/components/listener/listener.js';

import Button from 'client/js/components/parts/GameInterface/Elements/Button.react.js';

export class AActionButton extends MoreartyComponent {
	constructor(delegateClass) {
		super();
		this._delegateClass = delegateClass;
	}

	get gameBinding() {
		return this.getBinding('game');
	}

	get myBinding() {
		return this.getBinding('me');
	}

	get theme() {
		return AActionButton.defaultTheme;
	}

	render() {
		const theme = this.theme;
		var color = theme.normal;
		const activated = this.hasEnoughResources();
		if (activated) {
			if (this.isActive()) { color = theme.focus; }
		} else {
			color = theme.disabled;
		}

		return <Button label={this.label} color={color}
		               enable={activated} onClick={this.toggleAction.bind(this)}
			{...this.props} />;
	}

	isActive() {
		return this.gameBinding.get('action') === this._delegateClass.ACTION;
	}

	toggleAction() {
		if (!this.isActive()) {
			gameManager().setDelegate(new this._delegateClass(gameManager()));
		} else {
			gameManager().setDelegate(null);
		}
	}
}

AActionButton.defaultTheme = {
	normal: '#ff8200',
	focus: '#ffbc00',
	disabled: '#9d3700'
};

AActionButton.defaultProps = {
	x: 0,
	y: 0,
	height: 20,
	width: 50
};

export default AActionButton;
