import BuildColony from 'client/js/components/parts/GameInterface/actions/BuildColony.react.js';

import { MyBinding } from 'client/js/components/common/players.js';
import Button from 'client/js/components/parts/GameInterface/Elements/Button.react.js';
import Empty from 'client/js/components/parts/GameInterface/Elements/Empty.react.js';

import tests from 'client/js/components/libs/test.js';
import React from 'react'; // eslint-disable-line no-unused-vars

class Wrapper extends tests.Wrapper {
	render() {
		return <BuildColony binding={{ game: this.binding.sub('game'), me: this.binding.sub('me') }} />;
	}
}

fdescribe('BuildColony', function() {
  beforeEach(function() {
    const ctx = tests.getCtx();
    this.binding = ctx.getBinding();
		this.root = tests.bootstrap(ctx, Wrapper);
    this.setCards = function(cards) {
      const binding = MyBinding.from(this.binding);
      binding.setCards(cards);
      binding.save(this.binding);
    };
  });

  describe('resource dependency', function() {
    it('detects if there are enough resources for a colony', function(done) {
      this.setCards({ bois: 1, ble: 1, mouton: 1, tuile: 1 });
			setTimeout(() => {
        expect(tests.getRenderedElements(this.root, Button)).toHaveLength(1);
				done();
			}, 100)
    });

    it('detects if there are not enough resources for a colony', function(done) {
      this.setCards({ bois: 3, ble: 2 });
			setTimeout(() => {
	      expect(tests.getRenderedElements(this.root, Empty)).toHaveLength(1);
				done();
			}, 100);
    });
  });

  it('renders nothing there are not enough resources for a colony', function(done) {
    this.setCards({ bois: 3, ble: 2 });
		setTimeout(() => {
      expect(tests.getRenderedElements(this.root, Empty)).toHaveLength(1);
			done();
		}, 100);
  });

	describe('with enough resources', function() {
		beforeEach(function(done) {
			this.setCards({ bois: 1, ble: 1, mouton: 1, tuile: 1 });
			setTimeout(done, 100);
		});

	  it('displays a button to build colony', function() {
			const buttons = tests.getRenderedElements(this.root, Button);
			expect(buttons).toHaveLength(1);

			const button = buttons[0];
			expect(button.props.label).toEqual('Build colony');
	  });
	});

	describe('on click', function() {
		beforeEach(function(done) {
			this.setCards({ bois: 1, ble: 1, mouton: 1, tuile: 1 });
			this.getButton = function() {
				return tests.getRenderedElements(this.root, Button)[0];
			};
			setTimeout(() => {
				tests.simulateClick(this.getButton());
				done();
			}, 100);
		});

		it('highlights the button', function() {
			const button = this.getButton();
			expect(button.props.label).toEqual('(( Build colony ))');
		});
	});
});
