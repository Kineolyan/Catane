import _ from 'lodash';

import { logger } from 'libs/log/logger';

let mixinId = 0;
export default class Mixin {
	constructor(name) {
		this._name = name || `mixin-${++mixinId}`;
		this._init = _.noop;
	}

	initialize(method) {
		this._init = method;
		return this;
	}

	withMethods(methods) {
		this._methods = methods;
		return this;
	}

	mixWith(item) {
		try {
			_.forEach(this._methods, (method, name) => {
				if (item.hasOwnProperty(name)) {
					logger.warn(`Overriding method ${name} of ${item} ${item[name]} by ${method}`);
				}
				item[name] = method;
			});
			this._init(item);

			return item;
		} catch (err) {
			logger.error(`Failed to mix ${this._name} with ${item}`);
			throw err;
		}
	}
}
