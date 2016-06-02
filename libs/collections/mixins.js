import _ from 'lodash';

export class MixinBuilder {
	constructor() {}

	initializeWith(method) {
		this._init = method;
	}

	withMethods(methods) {
		this._methods = methods;
	}

	includeTo(item) {

	}
}
