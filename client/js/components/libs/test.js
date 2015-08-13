import jsdom from 'jsdom';
import React from 'react';

import * as Contexts from 'client/js/components/libs/context';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';
import { MockSocketIO } from 'libs/mocks/sockets';
import Socket from 'client/js/components/libs/socket';
import listener from 'client/js/components/listener/listener';
import * as maps from 'libs/collections/maps';

export class TestWrapper extends MoreartyComponent {
	get binding() {
		return this.getDefaultBinding();
	}

	render() {
		return (<div>Wrapper empty content. Override !</div>);
	}
}

var testsObj = {
	jsdom: jsdom,
	ctx: null, // TODO can it be removed
	/**
	 * Gets react sub elements as an array for non-DOM elements - ie react art elements
	 * @param  {Object} inst root element
	 * @param  {Class} type class to look for
	 * @return {Array} all elements found
	 */
	getRenderedElements: function(inst, type) {
		if (!inst) {
			return [];
		}

		var internal = inst._reactInternalInstance;
		if (!internal) {
			internal = inst;
		}

		var ret = (internal._currentElement.type.displayName && internal._currentElement.type.displayName === type.displayName) ? [internal._currentElement] : [];
		if (internal._renderedComponent) {
			ret = ret.concat(this.getRenderedElements(internal._renderedComponent, type));
		} else if (internal._renderedChildren) {
			for (var i in internal._renderedChildren) {
				if (internal._renderedChildren.hasOwnProperty(i)) {
					ret = ret.concat(this.getRenderedElements(internal._renderedChildren[i], type));
				}
			}
		}

		return ret;
	},
	getCtx: function(initialState) {
		if (initialState === undefined) {
			initialState = Contexts.getDefaultContext({ id: 1, name: 'Bob' });
			initialState.message = 'Hello';
			initialState.server = { id: 1, sid: 2 };
		}

		this.ctx = Contexts.createContext(initialState);
		return this.ctx;
	},
	Wrapper: TestWrapper,
	bootstrap: function(ctx, rootComp) {
		var Bootstrap = ctx.bootstrap(rootComp);
		return React.addons.TestUtils.renderIntoDocument(<Bootstrap />);
	},
	/**
	 * Creates a mock server with socket simulation.
	 * This initializes the listener.
	 * @param {Context} ctx context to use for server
	 * @return {MockSocket} mock of a socket
	 */
	createServer: function(ctx) {
		var socket = new MockSocketIO();
		listener.startListen(new Socket(socket), ctx);

		return socket;
	}
};

const EVENTS = {
	Click: 'onClick'
};
for (let [event, key] of maps.entries(EVENTS)) {
	testsObj['simulate' + event] = function(element) {
		element.props[key]();
	};
}

const tests = testsObj;
export default tests;