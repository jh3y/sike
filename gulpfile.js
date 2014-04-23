var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	coffee = require('gulp-coffee'),
	sources = {
		coffee: "src/coffee/*.coffee"
	},
	destinations = {
		build: "lib/"
	};
/*WATCH COFFEE*/
gulp.task('coffee:watch', function(event) {
	gulp.watch(sources.coffee, ["coffee:build"]);
});
/*BUILD COFFEE*/
gulp.task('coffee:build', function(event) {
	return gulp.src(sources.coffee)
		.pipe(plumber())
		.pipe(coffee())
		.pipe(gulp.dest(destinations.build));
});
/*DEFAULT TASK*/
gulp.task('default', ["coffee:watch"]);