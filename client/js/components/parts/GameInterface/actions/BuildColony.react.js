import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react.js';
import React from 'react'; // eslint-disable-line no-unused-vars

import { gameManager } from 'client/js/components/listener/listener.js';
import { MyBinding } from 'client/js/components/common/players.js';
import { Board } from 'client/js/components/libs/globals.js';
import BuildColonyDelegate from 'client/js/components/listener/delegates/buildColony.js';

import Button from 'client/js/components/parts/GameInterface/Elements/Button.react.js';

export class BuildColony extends MoreartyComponent {

  get gameBinding() {
    return this.getBinding('game');
  }

  get myBinding() {
    return this.getBinding('me');
  }

  render() {
	  var label = 'Build colony';
	  var color = BuildColony.theme.normal;
	  const activated = this.hasEnoughResources();
    if (activated) {
		  if (this.isActive()) { color = BuildColony.theme.focus; }
    } else {
		  color = BuildColony.theme.disabled;
    }

	  return <Button label={label} color={color}
	                 enable={activated} onClick={this.toggleAction.bind(this)}
		               {...this.props} />;
  }

  hasEnoughResources() {
    const myBinding = new MyBinding(this.myBinding);
    const resources = myBinding.resourceMap;
    return resources[Board.resourceName.bois] >= 1
      && resources[Board.resourceName.tuile] >= 1
      && resources[Board.resourceName.mouton] >= 1
      && resources[Board.resourceName.ble] >= 1;
  }

  isActive() {
    return this.gameBinding.get('action') === BuildColonyDelegate.ACTION;
  }

  toggleAction() {
    if (!this.isActive()) {
      gameManager().setDelegate(new BuildColonyDelegate(gameManager()));
    } else {
      gameManager().setDelegate(null);
    }
  }
}

BuildColony.theme = {
	normal: '#ff8200',
	focus: '#ffbc00',
	disabled: '#9d3700'
};

BuildColony.defaultProps = {
	x: 0,
	y: 0,
	height: 20,
	width: 50
};

BuildColony.displayName = 'BuildColony';

export default BuildColony;
