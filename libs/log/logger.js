var util = require('util');

export const Level = {
	ALL: Symbol('All'),
	SILENT: Symbol('Silent'),
	DEFAULT: Symbol('Default')
};

export class DebugLogger {
	get level() {
		return Level.ALL;
	}

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
	get level() {
		return Level.DEFAULT;
	}

	info() {}
	log() {}
}

export class SilentLogger extends ProductionLogger {
	get level() {
		return Level.SILENT;
	}

	error() {}
	warn() {}
	info() {}
}

export function createLogger(level = Level.DEFAULT) {
	switch(level) {
		case Level.SILENT:
			return new SilentLogger();

		case Level.ALL:
			return new DebugLogger();

		default:
		case Level.DEFAULT:
			return new ProductionLogger();
	}
}

class LoggerWrapper {
	constructor(logger) {
		this._instance = logger;
	}

	get level() {
		return this._instance.level;
	}

	configure(level) {
		if (level !== this._instance.level) {
			this._instance = createLogger(level);
		}
	}

	error() {
		this._instance.error(...arguments);
	}

	warn() {
		this._instance.warn(...arguments);
	}

	info() {
		this._instance.info(...arguments);
	}

	log() {
		this._instance.log(...arguments);
	}
}

export const logger = new LoggerWrapper(createLogger());