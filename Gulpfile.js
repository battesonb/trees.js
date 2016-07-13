var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps')

gulp.task('sass', sassTask);
gulp.task('watch', watchTask);

var outDir = './dist';

function sassTask() {
	return gulp.src('./src/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
}

function watchTask() {
	gulp.watch('./src/*.scss', ['sass']);
}