'use strict';

// Sets the paths for absolute requires
var path = require('path');
process.env.NODE_PATH = path.join(__dirname, 'build');
// Resets the module paths
require('module').Module._initPaths();

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var cached = require('gulp-cached');
var jas = require('gulp-jasmine');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var browserify = require('browserify');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');

function pathItem(name) {
	return function(children) {
		var items = [name];
		if (this instanceof Function) {
			items.unshift(this());
		}
		if (children) {
			items.push(children);
		}
		return path.join.apply(path, items);
	};
}

var PATHS = pathItem('.');
PATHS.bin = pathItem('bin');

PATHS.server = pathItem('server');
PATHS.libs = pathItem('libs');

PATHS.client = pathItem('client');
PATHS.client.scssLib = pathItem('scss_lib');
PATHS.client.scss = pathItem('scss');
PATHS.client.js = pathItem('js');

PATHS.build = pathItem('build');
PATHS.build.libs = pathItem('libs');
PATHS.build.server = pathItem('server');
PATHS.build.client = pathItem('client');
PATHS.build.client.js = pathItem('js');

PATHS.specs = pathItem('specs');
PATHS.specs.matchers = pathItem('matchers');

PATHS.docs = pathItem('docs');
PATHS.docs.libs = pathItem('libs');

PATHS.bower = pathItem('bower');

/* -- Actions -- */

/** Builds all js transpiling from ES6 to ES5 */
function buildLibs() {
	return gulp.src([PATHS.libs('**/*.js')], { base: PATHS.libs() })
			.pipe(cached('libs-js'))
			.pipe(plumber({ errorHandler: notify.onError("Build libs : <%= error.message %>") }))
			.pipe(babel({ sourceRoot: PATHS.libs() }))
			.pipe(plumber.stop())
			.pipe(gulp.dest(PATHS.build.libs()));
}
function buildServer() {
	return gulp.src([PATHS.server('**/*.js')], { base: PATHS.server() })
			.pipe(cached('server-js'))
			.pipe(plumber({ errorHandler: notify.onError("Build server : <%= error.message %>") }))
			.pipe(babel({ sourceRoot: PATHS.server() }))
			.pipe(plumber.stop())
			.pipe(gulp.dest(PATHS.build.server()));
}

function buildClient() {
	return gulp.src(PATHS.client.js('components/**/*.js'))
			.pipe(cached('client-js'))
			.pipe(plumber({ errorHandler: notify.onError("Build:jsx : <%= error.message %>") }))
			.pipe(babel())
			.pipe(plumber.stop())
			.pipe(gulp.dest(PATHS.build.client('js/components')));
}

function runTests(stream, verbose) {
	if (verbose === undefined) {
		verbose = true;
	}

	return stream
			.pipe(jas({ includeStackTrace: true, verbose: verbose }));
}

function testJsLibs(verbose) {
	return runTests(gulp.src([
		PATHS.specs('server-env.js'),
		PATHS.specs.matchers('**/*.js'),
		PATHS.build.libs('**/*.spec.js')
	]), verbose);
}

function testJsServer(verbose) {
	return runTests(gulp.src([
		PATHS.specs('server-env.js'),
		PATHS.specs.matchers('**/*.js'),
		PATHS.build.server('**/*.spec.js')
	]), verbose);
}

function testJsClient(verbose) {
	return runTests(gulp.src([
		PATHS.specs('server-env.js'),
		PATHS.specs('client-env.js'),
		PATHS.specs.matchers('**/*.js'),
		PATHS.build.client.js('components/libs/test.js'),
		PATHS.build.client.js('**/*.spec.js')
	]), verbose);
}

function cleanCache() {
	// Clear all caches to perform a full actions
	cached.caches = {};
}

function cleanOutput(done) {
	return del([
		PATHS.build()
	], done);
}

/* --  Build tasks -- */

gulp.task('build:js:libs', buildLibs);

gulp.task('build:js:server', ['build:js:libs'], buildServer);

gulp.task('build:sass', function() {
	return gulp.src([
		PATHS.client.scss('*.scss'),
		PATHS.client.scssLib('**/*.scss')
	])
			.pipe(sass({
				includePaths: [PATHS.client.scssLib()]
			}))
			.pipe(gulp.dest(PATHS.build.client('css')));
});

gulp.task('build:js:client', ['build:js:libs'], buildClient);

gulp.task('build:js', ['build:js:libs', 'build:js:server', 'build:js:client']);

gulp.task('build:dependencies', function() {
	return gulp.src([PATHS.bower('/*/dist/**/*')])
			.pipe(gulp.dest(PATHS.build.client('bower')));
});

gulp.task('build:browserify', ['build:js:client', 'build:dependencies'], function() {
	return browserify({
		entries: './' + PATHS.build.client('js/components/main.js'),
		debug: true
	}).bundle()
			.pipe(source('catane.js')) // the output filename
			.pipe(gulp.dest(PATHS.build.client('js'))); // the output directory
});

gulp.task('build', ['build:js', 'build:sass', 'build:browserify']);

/* -- Test task -- */

gulp.task('test:js:libs', ['build:js:libs'], testJsLibs);

gulp.task('test:js:server', ['build:js:server'], testJsServer);

gulp.task('test:js:client', ['build:js:client'], testJsClient);

gulp.task('test:js', ['test:js:libs', 'test:js:server', 'test:js:client']);

gulp.task('test:lint', function() {
	return gulp.src([
		PATHS.bin('*.js'),
		PATHS.libs('**/*.js'),
		PATHS.client('**/*.js'),
		PATHS.server('**/*.js')
	])//.pipe(plumber({ errorHandler: notify.onError("test:lint : <%= error.message %>") }))
			.pipe(eslint())
			.pipe(eslint.formatEach('stylish'))
			.pipe(eslint.failOnError());
	//.pipe(plumber.stop());
});

gulp.task('test', ['test:js', 'test:lint']);

/* -- Watcher -- */

// Special task to order properly tasks
gulp.task('watch:js:test-libs', ['build:js:libs'], function() {
	return testJsLibs(false);
});

gulp.task('watch:js:test-server', ['build:js:server'], function() {
	return testJsServer(false);
});

gulp.task('watch:js:test-client', ['build:js:client'], function() {
	return testJsClient(false);
});

gulp.task('watch:js', function() {
	gulp.watch([
		PATHS.server('**/*.js') // Tests server and client when server changes
	], ['watch:js:test-server']);
	/* Changes in server should also run client tests or at least integration tests but apparently, there are none of them. */

	gulp.watch([
		PATHS.client('**/*.js'), // Tests only client when client changes
	], ['watch:js:test-client']);

	gulp.watch([
		PATHS.libs('**/*.js'), // Run all tests
		PATHS.specs('**/*.js') // Run all tests when spec helper changes
	], ['watch:js:test-libs', 'watch:js:test-server', 'watch:js:test-client']);
});

gulp.task('watch:sass', function() {
	gulp.watch(PATHS.client.scss('*.scss'), ['build:sass']);
});

gulp.task('watch', ['watch:js', 'watch:sass']);

/* -- Documentation -- */

gulp.task('docs:install', function() {
	var request = require('request');

	// Fetch the master version of mermaid for documentation
	return request('https://raw.githubusercontent.com/knsv/mermaid/master/dist/mermaid.full.min.js')
			.pipe(fs.createWriteStream(PATHS.docs.libs('mermaid.js')));
});

gulp.task('docs:serve', function() {
	// Somehow provide a way to navigate through documentation
});

gulp.task('docs', ['docs:install', 'docs:serve']);

//default gulp
gulp.task('default', ['build', 'test', 'docs']);


gulp.task('clean:cache', cleanCache);

gulp.task('clean:output', cleanOutput);

gulp.task('clean', ['clean:output', 'clean:cache']);

//develop task
gulp.task('develop', function() {
	var nodemon = require('nodemon');
	var browserSync = require('browser-sync');

	var bs;

	gulp.watch(PATHS.client('**/*.js'), function() {
		runSequence('build:browserify', function() {
			nodemon.emit('restart'); //restart the nodemon server
		});
	});

	nodemon({
		script: 'bin/catane',
		stdout: false,
		ignore: ["**/*"]
	});

	nodemon.on('stdout', function(buffer) {
		var data = buffer.toString();
		console.log(data);
		if (data.match(/Running on port/)) {
			if (bs) {
				bs.reload();
			} else {
				bs = browserSync.init({
					proxy: "localhost:3000",
					port: 4000,
					open: false,
					ghostMode: false
				});
			}
		}
	});
});
/**
 * Master task to rebuild all the project
 * Named in hommage to 'Legend of Korra'
 * This will perform all actions to build and test the application.
 */
gulp.task('do_the_thing', function() {
	runSequence('clean', 'build', 'test', function() {
		console.log('All things are done Sir :)');
		process.exit();
	});
});
