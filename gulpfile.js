var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var uglifyify = require('uglifyify');
var del = require('del');
var paths = { home: './index.js', js: './js/*.js' };

gulp.task('clean', function(done) {
  del(['stellarbio'], done);
});

gulp.task('build', ['clean'], function() {
  browserify(paths.home)
    .transform(reactify, {"es6": true})
    .bundle()
    .pipe(uglifyify())
    .pipe(source('stellarbio.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch(paths.home, ['build']);
});

gulp.task('default', ['watch', 'build']);
