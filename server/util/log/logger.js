var util = require('util');

export function createLogger(level = Level.ALL) {
	switch(level) {
	case Level.SILENT:
		return new SilentLogger();

	default:
	case Level.ALL:
		return new Logger();
	}
}

export class Logger {
	error() {
		arguments[0] = `\e[31m${arguments[0]}\e[0m`;
		this.out(...arguments);
	}

	warn() {
		arguments[0] = `\e[33m${arguments[0]}\e[0m`;
		this.out(...arguments);
	}

	info() {
		arguments[0] = `\e[34m${arguments[0]}\e[0m`;
		this.out(...arguments);
	}

	log() {
		this.out(...arguments);
	}

	out() {
		arguments[0] += '\n';
		process.stdout.write(util.format(...arguments));
	}
}

export class SilentLogger extends Logger {
	info() {}
	log() {}
}

export const Level = {
	ALL: Symbol('All'),
	SILENT: Symbol('Silent')
};