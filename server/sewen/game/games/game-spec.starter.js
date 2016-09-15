import _ from 'lodash';

import * as starter from 'server/core/game/games/game-spec.starter.js';

import SewenGame from 'server/sewen/game/games/SewenGame';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';

starter.games.registerGame(SewenGame);

class GameEnv extends starter.GameEnv {
  constructor() {
    super(SewenGame.name, SewenPlayer);
  }

  start() {
    this.game.start();
  }
}

export {
  GameEnv
};
