'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var jas = require('gulp-jasmine');
var jshint = require('gulp-jshint');

// var refresh = require('gulp-livereload');
// var livereload = require('tiny-lr');
// var server = livereload();

function pathItem(name) {
	return function(children) {
		var items = [ name ];
		if (this instanceof Function) { items.unshift(this()); }
		if (children) { items.push(children); }

		return path.join.apply(path, items);
	}
}


var PATHS = pathItem('.');
PATHS.bin = pathItem('bin');
PATHS.client = pathItem('client');
PATHS.client.scss_lib = pathItem('scss_lib');
PATHS.server = pathItem('server');
PATHS.specs = pathItem('specs');
PATHS.docs = pathItem('docs');
PATHS.docs.libs = pathItem('libs');

/* --  Build tasks -- */

gulp.task('build:sass', function () {
	// var dest = PATHS.client.public.styles();
	var dest = 'client/';

  return gulp.src([PATHS.client('**/*.scss'), PATHS.client.scss_lib('**/*.scss')])
  		.pipe(cached('scss'))
  		.pipe(remember('scss'))
  		.pipe(sass({
  			includePaths: [ PATHS.client.scss_lib() ]
  		}))
      .pipe(gulp.dest(dest));
});

gulp.task('build', ['build:sass']);

/* -- Test task -- */

gulp.task('test:jasmine', function() {
  return gulp.src([ PATHS.server('**/*.spec.js'), PATHS.client('**/*.spec.js')])
  	.pipe(jas({includeStackTrace: true}));
});

gulp.task('test:lint', function() {
  return gulp.src([
  		PATHS.bin('*.js'),
  		PATHS.client('**/*.js'),
  		PATHS.server('**/*.js')
  	]).pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', ['test:jasmine', 'test:lint']);

/* -- Live reload -- */

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