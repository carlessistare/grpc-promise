const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['test/**/*.js', 'lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('table'))
    .pipe(eslint.failAfterError());
});


gulp.task('test', ['lint'], function () {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha({require: ['should']}));
});

gulp.task('test-no-lint', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha());
});
