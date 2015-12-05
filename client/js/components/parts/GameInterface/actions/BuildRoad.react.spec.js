import BuildRoad from 'client/js/components/parts/GameInterface/actions/BuildRoad.react.js';

import { MyBinding } from 'client/js/components/common/players.js';
import { BoardBinding } from 'client/js/components/common/map';
import { gameManager } from 'client/js/components/listener/listener';
import BuildRoadDelegate from 'client/js/components/listener/delegates/buildRoad';

import Button from 'client/js/components/parts/GameInterface/Elements/Button.react.js';

import tests from 'client/js/components/libs/test.js';
import React from 'react'; // eslint-disable-line no-unused-vars

class Wrapper extends tests.Wrapper {
	render() {
		return <BuildRoad binding={{ game: this.binding.sub('game'), me: this.binding.sub('me') }} />;
	}
}

describe('<BuildRoad>', function() {
  beforeEach(function() {
    this.ctx = tests.getCtx();
    this.binding = this.ctx.getBinding();

		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [{ x: 0, y: 0 }],
			cities: [{ x: 0, y: 1 }],
			paths: [
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, owner: 1 },
				{ from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, owner: 2 },
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
				{ from: { x: 0, y: 0 }, to: { x: 2, y: 1 } }
			],
			thieves: { x: 0, y: 0 }
		});
		helper.save(this.binding);

		this.root = tests.bootstrap(this.ctx, Wrapper);
    this.setCards = function(cards) {
      const binding = MyBinding.from(this.binding);
      binding.setCards(cards);
      binding.save(this.binding);
    };

	  this.getButton = function() {
		  return tests.getRenderedElements(this.root, Button)[0];
	  };
  });

  it('renders nothing there are not enough resources for building a path', function(done) {
    this.setCards({ caillou: 3 });
		setTimeout(() => {
			const button = this.getButton();
      expect(button.props.color).toEqual(BuildRoad.theme.disabled);
			done();
		}, 100);
  });

  describe('resource dependency for building a road', function() {
    it('detects if there are enough resources', function(done) {
      this.setCards({ bois: 1, tuile: 1 });
			setTimeout(() => {
				const button = this.getButton();
				expect(button.props.color).toEqual(BuildRoad.theme.normal);
				done();
			}, 100)
    });

    it('detects if there are not enough resources', function(done) {
      this.setCards({ ble: 4 });
			setTimeout(() => {
				const button = this.getButton();
				expect(button.props.color).toEqual(BuildRoad.theme.disabled);
				done();
			}, 100);
    });
  });

	describe('with enough resources', function() {
		beforeEach(function(done) {
			this.setCards({ bois: 1, tuile: 1 });
			setTimeout(done, 100);
		});

	  it('displays a button to build a road', function() {
			const buttons = tests.getRenderedElements(this.root, Button);
			expect(buttons).toHaveLength(1);

			const button = buttons[0];
		  expect(button.props.color).toEqual(BuildRoad.theme.normal);
			expect(button.props.label).toEqual('Build road');
	  });
	});

	describe('on click', function() {
		beforeEach(function(done) {
			tests.createServer(this.ctx);
			this.mgr = gameManager();
			spyOn(this.mgr, 'setDelegate').and.callThrough();

			this.setCards({ bois: 1, tuile: 1 });
			setTimeout(() => {
				tests.simulateClick(this.getButton());
				setTimeout(done, 100);
			}, 100);
		});

		it('highlights the button', function() {
			const button = this.getButton();
			expect(button.props.color).toEqual(BuildRoad.theme.focus);
		});

		it('saves action in the context', function() {
			expect(this.binding.get('game.action')).toEqual(BuildRoadDelegate.ACTION);
		});

		it('sets a delegate to handle building', function() {
			expect(this.mgr.setDelegate).toHaveBeenCalled();
		});

		describe('after second click', function() {
			beforeEach(function(done) {
				tests.simulateClick(this.getButton());
				setTimeout(done, 100);
			});

			it('un-highlights the button', function() {
				const button = this.getButton();
				expect(button.props.color).toEqual(BuildRoad.theme.normal);
			});

			it('erases action from the context', function() {
				expect(this.binding.get('game.action')).toEqual(null);
			});

			it('unsets the delegate', function() {
				expect(this.mgr.setDelegate).toHaveBeenCalled();
				expect(this.mgr.setDelegate.calls.mostRecent().args).toEqual([null]);
			});
		});
	});
});
