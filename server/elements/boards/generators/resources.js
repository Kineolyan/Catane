import { shuffle } from 'server/util/arrays';

export class RandomResources {

	constructor(size) {
		this._resources = [ 'desert' ]; // Only one desert

		var res = [ 'bois', 'mouton', 'ble', 'caillou', 'tuile' ];
		var nbRes = res.length;
		for (let i = 0, end_ = size - 1; i < end_; i+= 1) {
			this._resources.push(res[i % nbRes]);
		}

		// Randomize the resources
		this._resources = shuffle(this._resources);
	}

	get resources() {
		return this._resources;
	}

	[Symbol.iterator]() {
		var i = 0;
		var generator = this;
    return {
      next() {
      	if (i < generator._resources.length) {
	      	var value = generator._resources[i];
	      	i += 1;

	        return { done: false, value: value };
   			} else {
   				return { done: true };
   			}
    	}
    };
  }

}