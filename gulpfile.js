const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./test/**/*.js', './lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('table'))
    .pipe(eslint.failAfterError());
});

gulp.task('mocha', ['lint'], function() {
  return gulp.src('./test/**/*.coffee')
    .pipe(mocha());
});

gulp.task('test', ['mocha'], function() {});
