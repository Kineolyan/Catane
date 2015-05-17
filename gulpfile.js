'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var jas = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var browserify = require('browserify');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');

function pathItem(name) {
	return function(children) {
		var items = [ name ];
		if (this instanceof Function) { items.unshift(this()); }
		if (children) { items.push(children); }
		return path.join.apply(path, items);
	};
}

var PATHS = pathItem('.');
PATHS.bin = pathItem('bin');
PATHS.client = pathItem('client');
PATHS.server = pathItem('server');
PATHS.build = pathItem('build');
PATHS.build.server = pathItem('server');
PATHS.build.client = pathItem('client');

PATHS.client.scssLib = pathItem('scss_lib');
PATHS.client.components = pathItem('scss');

PATHS.client.js = pathItem('js');
PATHS.server = pathItem('server');
PATHS.specs = pathItem('specs');
PATHS.docs = pathItem('docs');
PATHS.docs.libs = pathItem('libs');
PATHS.specs = pathItem('specs');
PATHS.specs.matchers = pathItem('matchers');

/* -- Actions -- */

/** Builds all js transpiling from ES6 to ES5 */
function buildJs() {
  return gulp.src([PATHS.server('**/*.js')], { base: PATHS.server() })
    .pipe(cached('server-js'))
    .pipe(remember('server-js'))
    .pipe(babel({ sourceRoot: PATHS.server() }))
    .pipe(gulp.dest(PATHS.build.server()));
}

function buildJsx() {
  return gulp.src(PATHS.client.js('components/**/*.js'))
    .pipe(plumber({errorHandler: notify.onError("Build:jsx : <%= error.message %>")}))
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest(PATHS.build.client('js/components')));
}

/** Performs all unit tests */
function testUnit(verbose) {
  if (verbose === undefined) { verbose = true; }

  return gulp.src([
      PATHS.specs('env.js'),
      PATHS.specs.matchers('**/*.js'),
      PATHS.build.server('**/*.spec.js'),
      PATHS.build.client('**/*.spec.js')
    ]).pipe(jas({includeStackTrace: true, verbose: verbose}));
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

gulp.task('build:js', buildJs);

// Special task to order properly tasks
gulp.task('watch:js:test', ['build:js'], function() {
  return testUnit(false);
});

gulp.task('watch:js', function() {
  gulp.watch([
      PATHS.server('**/*.js'),
      PATHS.specs('**/*.js')
    ], ['build:js', 'watch:js:test']);
});

gulp.task('build:sass', function () {
  return gulp.src([
        PATHS.client.components('*.scss'),
        PATHS.client.scssLib('**/*.scss')
      ])
  		.pipe(sass({
  			includePaths: [ PATHS.client.scssLib() ]
  		}))
      .pipe(gulp.dest(PATHS.build.client('css')));
});

gulp.task('build:jsx', buildJsx);

gulp.task('build:browserify', ['build:jsx'], function() {
  return browserify({
      entries: './' + PATHS.build.client('js/components/main.js'),
      debug: true
    }).bundle()
    .pipe(source('catane.js')) // the output filename
    .pipe(gulp.dest(PATHS.build.client('js'))); // the output directory
});

gulp.task('build', ['build:js', 'build:sass', 'build:browserify']);

/* -- Watcher -- */
gulp.task('watch:jsx', function() {
  gulp.watch(PATHS.client.js('components/**/*.js'), ['watch:jsx:test']);
});

gulp.task('watch:jsx:test', ['build:browserify'], function() {
  return testUnit(false);
});

gulp.task('watch:sass', function() {
  gulp.watch(PATHS.client.components('*.scss'), ['build:sass']);
});

gulp.task('watch', ['watch:js', 'watch:jsx', 'watch:sass']);


/* -- Test task -- */

gulp.task('test:jsx', testUnit);
gulp.task('test:unit', testUnit);


gulp.task('test:lint', function() {
  return gulp.src([
  		PATHS.bin('*.js'),
  		PATHS.client('**/*.js'),
  		PATHS.server('**/*.js')
  	]).pipe(plumber({errorHandler: notify.onError("test:lint : <%= error.message %>")}))
    .pipe(jshint({linter : require('jshint-jsx').JSXHINT }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(plumber.stop());
});

gulp.task('test', ['test:unit', 'test:lint']);

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
gulp.task('default', [ 'build', 'test', 'docs' ]);


gulp.task('clean:cache', cleanCache);

gulp.task('clean:output', cleanOutput);

gulp.task('clean', [ 'clean:output', 'clean:cache' ]);

/**
 * Master task to rebuild all the project
 * Named in hommage to 'Legend of Korra'
 * This will perform all actions to build and test the application.
 */
gulp.task('do_the_thing', function() {
  runSequence('clean', 'build', 'test', 'docs:install', function() {
    console.log('All things are done Sir :)');
    process.exit();
  });
});
