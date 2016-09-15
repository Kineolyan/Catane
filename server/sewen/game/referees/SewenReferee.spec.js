import SewenReferee from 'server/sewen/game/referees/SewenReferee';

import _ from 'lodash';
import {GameEnv} from 'server/sewen/game/games/game-spec.starter';

describe('SewenReferee', function() {
  describe('#playCard', function() {
    beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();

      this.player = this.env.players[0].user.player;
      this.referee = new SewenReferee(this.env.game);
    });

    it('throws if the card is not in the player\'s deck', function() {
      const card = _.first(this.env.game.getPlayerDeck(this.player));
      // const otherPlayer = this.env.players[1];
      // With only 3 players, there is no duplicates
      expect(() => this.referee.playCard(this.player, [], card, {}))
        .toThrowError(/not in .+ deck/i);
    });

    // TODO complete with other tests on cases
  });

  // TODO complete with tests for others methods
});
