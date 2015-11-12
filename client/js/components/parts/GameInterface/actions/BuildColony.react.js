import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react.js';
import React from 'react'; // eslint-disable-line no-unused-vars

import { gameManager } from 'client/js/components/listener/listener.js';
import { MyBinding } from 'client/js/components/common/players.js';
import { Board } from 'client/js/components/libs/globals.js';
import BuildColonyDelegate from 'client/js/components/listener/delegates/buildColony.js';

import Button from 'client/js/components/parts/GameInterface/Elements/Button.react.js';
import Empty from 'client/js/components/parts/GameInterface/Elements/Empty.react.js';

export class BuildColony extends MoreartyComponent {

  get gameBinding() {
    return this.getBinding('game');
  }

  get myBinding() {
    return this.getBinding('me');
  }

  render() {
    if (this.hasEnoughResources()) {
      const label = this.isActive() ? '(( Build colony ))' : 'Build colony';

      return <Button label={label} color="#ff8200"
                     onClick={this.toggleAction.bind(this)}
                     {...this.props} />;
    } else {
      return <Empty x={this.props.x} y={this.props.y} />;
    }
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
    return this.gameBinding.get('action') === BuildColony.ACTION;
  }

  toggleAction() {
    if (!this.isActive()) {
      gameManager().setDelegate(new BuildColonyDelegate(gameManager()));
      this.gameBinding.set('action', BuildColony.ACTION);
    } else {
      gameManager().setDelegate(null);
      this.gameBinding.set('action', null);
    }
  }
}

BuildColony.ACTION = 'BuildColony';

BuildColony.defaultProps = {
	x: 0,
	y: 0,
	height: 20,
	width: 50
};

BuildColony.displayName = 'BuildColony';

export default BuildColony;
