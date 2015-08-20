// 
// glow.js - WebGL Object Wrapper
// Copyright 2015 Sean "rioki" Farrell
//

var gulp     = require('gulp');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var rename   = require('gulp-rename');
var http     = require('http');
var ecstatic = require('ecstatic');

var VERSION = '0.0.1';

// The order of the files must be enforced.
var libsrcs = [
  'src/pkzo.js'  
];

gulp.task('library', function() {
  return gulp.src(libsrcs)
    .pipe(concat('pkzo-' + VERSION + '.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('pkzo-' + VERSION + '.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['library']);

gulp.task('watch', ['default'], function() {
  http.createServer(ecstatic({ root: __dirname })).listen(3000);  
  gulp.watch('./src/*.js', ['library']);
});
