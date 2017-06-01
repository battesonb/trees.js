var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var tsify = require('tsify');

gulp.task('build', compile);
gulp.task('watch', watch);
gulp.task('unitTest', unitTestTask);
gulp.task('unitTestWatch', unitTestWatchTask);

var outDir = './dist';

function compile(watch) {
  var bundler = watchify(browserify('./src/main.ts', { debug: true }).plugin(tsify, {target: 'es6'}).transform(babelify.configure({extensions: [".ts",".js"]})));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('trees.bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  }

  if (watch) {
    gulp.watch('./src/**').on("change", function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

function unitTestTask() {
	return gulp.src('./test/*.js')
		.pipe(mocha());
}

function unitTestWatchTask() {
	gulp.watch('./test/*.js', ['unitTest']);
}