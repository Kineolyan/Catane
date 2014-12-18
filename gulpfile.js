'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
// var refresh = require('gulp-livereload');
// var livereload = require('tiny-lr');
// var server = livereload();

/* --  Build tasks -- */

var PATHS = {

};

gulp.task('sass', function () {
	// var dest = PATHS.client.public.styles();
	var dest = 'client/';

  return gulp.src(['client/**/*.scss', 'client/scss_lib/**/*.scss'])
  		.pipe(cached('scss'))
  		.pipe(remember('scss'))
  		.pipe(sass({
  			includePaths: [ 'client/scss_lib' ]
  		}))
      .pipe(gulp.dest(dest));
});

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

// gulp.task('default', [ 'serve' ]);