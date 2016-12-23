'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    purify = require('gulp-purifycss'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('compileSass', function() {
    return gulp.src('scss/application.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

gulp.task('purifyCSS', ['compileSass'], function() {
    return gulp.src('css/application.css')
        .pipe(purify(['js/*.js', 'index.html'], { minify: true }))
        .pipe(rename('application.min.css'))
        .pipe(gulp.dest('css'));
});

gulp.task('concatScripts', function() {
    return gulp.src([
            'js/jquery.js',
            'js/overlay.js',
            'js/fastclick.js',
            'js/foundation.js',
            'js/foundation.equalizer.js',
            'js/foundation.reveal.js'

        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
    return gulp.src('js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('cleanDev', function() {
    return del(['css/application.*', 'js/app.*']);
});

gulp.task('cleanBuild', function() {
    return del(['../css', '../js', '../img', '../*.html', 'css/application.*', 'js/app.*'], { force: true });
});

gulp.task('test', ['cleanDev', 'concatScripts', 'minifyScripts', 'compileSass', 'purifyCSS']);


gulp.task('build', ['cleanBuild', 'concatScripts', 'minifyScripts', 'compileSass', 'purifyCSS'], function() {
    return gulp.src(['css/application.min.css', 'js/app.min.js', 'index.html', 'img/logo.gif',   'img/avatars/*-sprite.jpg',  'img/social/*-sprite.svg', 'img/photos/**/*.jpg'], { base: './' })
        .pipe(gulp.dest('../'));
});

gulp.task('default', function() {
    gulp.start('test');
});
