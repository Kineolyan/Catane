'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var jas = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var to5 = require('gulp-6to5');
var react = require('gulp-react');
var browserify = require('browserify');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');

// var refresh = require('gulp-livereload');
// var livereload = require('tiny-lr');
// var server = livereload();

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
PATHS.client.components = pathItem('components');

PATHS.client.js = pathItem('js');
PATHS.server = pathItem('server');
PATHS.specs = pathItem('specs');
PATHS.docs = pathItem('docs');
PATHS.docs.libs = pathItem('libs');
PATHS.specs = pathItem('specs');
PATHS.specs.matchers = pathItem('matchers');

/* -- Actions -- */

/** BUild all js transpiling from ES6 to ES5 */
function buildJs() {
  return gulp.src([PATHS.server('**/*.js')], { base: PATHS.server() })
    .pipe(cached('js'))
    .pipe(remember('js'))
    .pipe(to5())
    .pipe(gulp.dest(PATHS.build.server()));
}

/** Performs all unit tests */
function testUnit() {

  return gulp.src([
      // './node_modules/gulp-6to5/node_modules/6to5/register.js',
      PATHS.specs('env.js'),
      PATHS.specs.matchers('**/*.js'),
      PATHS.build.server('**/*.spec.js'),
      PATHS.client('**/*.spec.js')
    ]).pipe(jas({includeStackTrace: true, verbose: true}));
  
}

function cleanCache() {
  // Clear all caches to perform a full actions
  cached.caches = {};
}

/* --  Build tasks -- */

gulp.task('build:js', buildJs);

// Special task to order properly tasks
gulp.task('watch:js:test', ['build:js'], testUnit);

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
      ]).pipe(cached('scss'))
  		.pipe(remember('scss'))
  		.pipe(sass({
  			includePaths: [ PATHS.client.scssLib() ]
  		}))
      .pipe(gulp.dest(PATHS.build.client('css')));
});

gulp.task('build:jsx', function() {
  return gulp.src(PATHS.client.js('components/**/*.jsx'))
      .pipe(plumber({errorHandler: notify.onError("Build:jsx : <%= error.message %>")}))
      .pipe(react({harmony: true}))
      .pipe(plumber.stop())
      .pipe(gulp.dest(PATHS.client.js('compiled')));
});

gulp.task('build:browserify', ['test:lint', 'build:jsx'], function(){
  var b = browserify('./' + PATHS.client.js('compiled/main.js'))
  var stream = b.bundle()
    .pipe(source('main.js')) // the output filename
    .pipe(gulp.dest(PATHS.build.client('js'))); // the output directory
  return stream;
});

gulp.task('build', ['build:js', 'build:sass', 'build:browserify']);

/* -- Watcher -- */
gulp.task('watch:jsx', function() {
  gulp.watch(PATHS.client.js('components/**/*.jsx'), ['build:browserify']);
});

gulp.task('watch:sass', function() {
  gulp.watch(PATHS.client.components('*.scss'), ['build:sass']);
});

gulp.task('watch', ['watch:js', 'watch:jsx', 'watch:sass']);

//watch + server

gulp.task('develop', ['watch', 'server']);

/* -- Test task -- */

gulp.task('test:unit', ['server'], testUnit);

gulp.task('test:lint', ['build:jsx'], function() {
  return gulp.src([
  		PATHS.bin('*.js'),
  		PATHS.client('**/*.js'),
  		PATHS.server('**/*.js')
  	]).pipe(plumber({errorHandler: notify.onError("test:lint : <%= error.message %>")}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(plumber.stop());
});

gulp.task('test', ['test:unit', 'test:lint']);

/* -- Live reload && watchs-- */

// gulp.task('css', function () {
//   gulp.src('app/**/*.css').pipe(refresh(server));
// });

// gulp.task('js', function () {
//   gulp.src('app/**/*.js').pipe(refresh(server));
// });

// gulp.task('livereload-server', function () {
//   server.listen(35729, function (err) {
//     if (err) { return console.log(err); }
//   });
// });

// gulp.task('serve', function () {
//   gulp.run('livereload-server');

//   gulp.watch('app/**/*.css', function (event) {
//     gulp.run('css');
//   });

//   gulp.watch('app/**/*.js', function (event) {
//     gulp.run('js');
//   });
// });


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

/* -- Launch server -- */
gulp.task('server', function(done) {
  var isDone = false;

  nodemon({ script: 'bin/catane', ignore: [PATHS.docs('libs/*')], stderr: false, stdout: false})
    .on('start', function() {
      if(!isDone) {
        isDone = true;
        done();
      }
    })
    .on('crash', function() {
      console.log('Server already launched, just failing');
    });  

});

gulp.task('clean:cache', cleanCache);

gulp.task('clean', [ 'clean:cache' ]);


/**
 * Master task to rebuild all the project
 * Named in hommage to 'Legend of Korra'
 * This will perform all actions to build and test the application.
 */
gulp.task('do_the_thing', function() {
  var runSequence = require('run-sequence');
  runSequence('clean', 'build', 'test', 'docs:install', function() {
    console.log('All things are done Sir :)');
  });
});
