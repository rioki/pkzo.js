// 
// pkzo.js - WebGL Object Wrapper
// Copyright 2015 Sean "rioki" Farrell
//

var gulp       = require('gulp');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var http       = require('http');
var ecstatic   = require('ecstatic');
var sourcemaps = require('gulp-sourcemaps');
var peg        = require('gulp-peg');
var glsl       = require('./gulp-glsl');

var VERSION = '0.0.1';

// The order of the files must be enforced.
var libsrcs = [
  'src/http.js',
  'src/pkzo.js',
  'src/shaders.js',
	'src/vector.js',
	'src/matrix.js',
	'src/Canvas.js',
	'src/Texture.js',
  'src/CubeMap.js',
	'src/Shader.js',
  'src/Scene.js',
	'src/Buffer.js',
  'src/PlyParser.js',
  'src/Mesh.js',
  'src/Material.js',
  'src/Entity.js',
  'src/Camera.js',
  'src/Object.js',
	'src/DirectionalLight.js',
  'src/PointLight.js',
  'src/SpotLight.js',
  'src/SkyBox.js',
  'src/EntityGroup.js',
  'src/Particle.js',
  'src/ParticleSystem.js',
  'src/Renderer.js'
];

gulp.task('glsl', function () {
  return gulp.src('src/*.glsl')
    .pipe(glsl('shaders.js', {ns: 'pkzo'}))
    .pipe(gulp.dest('./src/'));
});

gulp.task('PlyParser', function () {
  return gulp.src('src/PlyParser.peg')
    .pipe(peg({exportVar: 'pkzo.PlyParser'}))
    .pipe(gulp.dest('./src/'));
});

gulp.task('library', ['glsl', 'PlyParser'], function() {
  return gulp.src(libsrcs)
		.pipe(sourcemaps.init())
    .pipe(concat('pkzo-' + VERSION + '.js'))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('pkzo-' + VERSION + '.min.js'))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['library']);

gulp.task('watch', ['default'], function() {
  http.createServer(ecstatic({ root: __dirname })).listen(3000);  
  gulp.watch('./src/*', ['library'])
});
