var util = require('util');

export function createLogger(level = Level.DEFAULT) {
	switch(level) {
	case Level.SILENT:
		return new SilentLogger();

	case Level.ALL:
		return new DebugLogger();

	case Level.DEFAULT:
	default:
		return new ProductionLogger();
	}
}

export class DebugLogger {
	error() {
		arguments[0] = `\e[31m${arguments[0]}\e[0m`;
		DebugLogger.out(...arguments);
	}

	warn() {
		arguments[0] = `\e[33m${arguments[0]}\e[0m`;
		DebugLogger.out(...arguments);
	}

	info() {
		arguments[0] = `\e[34m${arguments[0]}\e[0m`;
		DebugLogger.out(...arguments);
	}

	log() {
		DebugLogger.out(...arguments);
	}

	static out() {
		arguments[0] += '\n';
		process.stdout.write(util.format(...arguments));
	}
}

export class ProductionLogger extends DebugLogger {
	info() {}
	log() {}
}

export class SilentLogger extends ProductionLogger {
	error() {}
	warn() {}
	info() {}
}

export const Level = {
	ALL: Symbol('All'),
	SILENT: Symbol('Silent'),
	DEFAULT: Symbol('Default')
};