var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	mocha = require('gulp-mocha'),
	source = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task('build', buildTask);
gulp.task('watch', watchTask);
gulp.task('unitTest', unitTestTask);
gulp.task('unitTestWatch', unitTestWatchTask);

var outDir = './dist';

function buildTask() {
	return browserify('./src/main.js', { standalone: 'trees' })
		.bundle()
		.pipe(source('trees.bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest(outDir));
}

function watchTask() {
	browserSync.init({
		server: './',
		notify: false
	});
	gulp.watch('./src/**', ['build']);
	gulp.watch('./dist/*.js').on('change', browserSync.reload);
}

function unitTestTask() {
	return gulp.src('./test/*.js')
		.pipe(mocha());
}

function unitTestWatchTask() {
	gulp.watch('./test/*.js', ['unitTest']);
}