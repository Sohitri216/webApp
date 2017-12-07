'use strict';
var gulp = require('gulp'),

    gulpIf = require('gulp-if'), // jshint ignore:line
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),

    env = process.env.NODE_ENV || 'development',
    outputClientDir = '../../webapp-deploy',
    inputDir = 'app',

    options = {
        libjs: [
            'bower_components/jquery/dist/jquery.min.js',
            // 'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
            'bower_components/moment/min/moment.min.js',
            'bower_components/angular-ui-calender/src/calender.js',
            'bower_components/fullcalendar/dist/fullcalendar.min.js',
            'bower_components/fullcalendar/dist/gcal.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.js'
        ]
    };

var onError = function(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
    })(err);

    this.emit('end');
};


gulp.task('assets', function() {
    return gulp.src(inputDir + '/resources/**/*')
        .pipe(gulp.dest(outputClientDir + '/resources'));
});

gulp.task('lib', function() {
    return gulp.src(inputDir + '/lib/**/*')
        .pipe(gulp.dest(outputClientDir + '/lib'));
});

// gulp.task('mpeg', function() {
//     return gulp.src(inputDir + '/lib/**/*')
//         .pipe(gulp.dest(outputClientDir + '/js'));
// });


gulp.task('html', function() {
    return gulp.src(inputDir + '/index.html')
        .pipe(gulp.dest(outputClientDir));
});


gulp.task('css', function() {
    gulp.src(inputDir + '/css/index.css')
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(outputClientDir + '/css'));
});


gulp.task('sass', function() {
    var config = {};
    if (env === 'production') {
        config.outputStyle = 'compressed';
    }
    return gulp.src(inputDir + '/sass/app.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass(config))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(outputClientDir + '/css'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Sass task completed',
            sound: 'Pop'
        }));
});


gulp.task('js', function() {
    return gulp.src(inputDir + '/js/main.js', {
            read: false
        })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html', '.tpl'],
                minify: true
            })
        }))
        // .pipe(gulpIf(env !== 'development', uglify()))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(outputClientDir + '/js'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Js task completed',
            sound: 'Pop'
        }));
});

gulp.task('vendor', function() {
    return gulp.src(options.libjs)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(outputClientDir + '/js'));
});

gulp.task('watch', function() {
    gulp.watch(inputDir + '/js/**/*.js', ['js']);
    gulp.watch(inputDir + '/js/**/*.html', ['js']);
    gulp.watch(inputDir + '/index.html', ['html']);
    gulp.watch(inputDir + '/sass/**/*.scss', ['sass']);
    gulp.watch(inputDir + '/css/**/*.css', ['css']);
    gulp.watch(inputDir + '/resources/**/*', ['assets']);

});

gulp.task('default', ['assets', 'html', 'js', 'css', 'sass', 'vendor', 'lib', 'watch']);
gulp.task('build', ['assets', 'html', 'js', 'vendor', 'lib', 'css', 'sass']);
