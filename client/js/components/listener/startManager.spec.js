//import StartManager from './startManager.js';

import Morearty from 'morearty';
import Immutable from 'immutable';

xdescribe('StartManager', function() {
	beforeEach(function() {
		this.ctx = Morearty.createContext({
			initialState: {
				start: {
					games: [],
					gameChosen: {}
				}
			}
		});
		
		//this.mgr = new StartManager(this.ctx);
	});

	describe('#gameJoin', function() {
		beforeEach(function() {
			this.ctx.set('start.games', Immutable.fromJS([
				{ id: 1, name: 'G1' }, { id: 2, name: 'G2' }
			]));
		});

		it('puts the asked game into start.gameChosen', function() {
			this.mgr.gameJoin({ id: 1 });

			var gameChosen = this.ctx.getBinding().get('start.gameChosen').toJS();
			expect(gameChosen).toEqual({ id: 1, name: 'G1' });
		});
	});
});