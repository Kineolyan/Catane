import nodeAssert from 'assert';

export function assertDefined(object, msg) {
	nodeAssert(object !== undefined, msg);
}

export function assert(...args) {
	nodeAssert(...args);
}
