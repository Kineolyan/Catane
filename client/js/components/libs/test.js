import jsdom from 'jsdom';
import Morearty from 'morearty';
import React from 'react';

import Globals from 'client/js/components/libs/globals';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export class TestWrapper extends MoreartyComponent {
	get binding() {
		return this.getDefaultBinding();
	}

	render() {
		return (<div>Wrapper empty content. Override !</div>);
	}
}

var tests = {
	jsdom: jsdom,
	ctx: null,
	getRenderedElements(inst, type) { // get react sub elements as an array for non-DOM elements - ie react art elements

		if (!inst) {
			return [];
		}

		var internal = inst._reactInternalInstance;
		if (!internal) {
			internal = inst;
		}

		var ret = (internal._currentElement.type.displayName && internal._currentElement.type.displayName === type.displayName) ? [internal._currentElement] : [];
		if (internal._renderedComponent) {
			ret = ret.concat(tests.getRenderedElements(internal._renderedComponent, type));
		} else if (internal._renderedChildren) {
			for (var i in internal._renderedChildren) {
				if (internal._renderedChildren.hasOwnProperty(i)) {
					ret = ret.concat(tests.getRenderedElements(internal._renderedChildren[i], type));
				}
			}
		}

		return ret;
	},
	getCtx(init = '') {
		var defaultInitState = {
			start: {
				games: [],
				gameChosen: {}
			},

			game: {
				board: [],
				dice: {
					enabled: false,
					rolling: false,
					values: [1, 1]
				},
				message: 'Hello'
			},

			me: {
				id: 1,
				resources: []
			},
			players: [ { id: 1, name: 'Bob', me: true } ],
			step: Globals.step.init,
			server: { id: 1, sid: 2 }
		};

		this.ctx = Morearty.createContext({
			initialState: init || defaultInitState
		});

		return this.ctx;
	},
	Wrapper: TestWrapper,
	bootstrap: function(ctx, rootComp) {
		var Bootstrap = ctx.bootstrap(rootComp);
		return React.addons.TestUtils.renderIntoDocument(<Bootstrap />);
	}
};

export default tests;