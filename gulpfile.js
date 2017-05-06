var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var app = {
    srcPath: 'src/',
    buildPath: 'build/',
    jsFile: 'h5.min.js',
    cssFile: 'h5.min.css'
};

gulp.task('lib', function () {
    gulp.src(app.srcPath + 'libs/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest(app.buildPath + 'libs'))
    gulp.src(app.srcPath + 'libs/*.css')
        .pipe(gulp.dest(app.buildPath + 'libs'))
});

gulp.task('js', function () {
    gulp.src(app.srcPath + 'js/*.js')
        .pipe($.concat(app.jsFile))
        .pipe($.uglify())
        .pipe(gulp.dest(app.buildPath + 'js'));
})

gulp.task('css', function () {
    gulp.src(app.srcPath + 'css/**')
        .pipe($.concat(app.cssFile))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.buildPath + 'css'));
})

gulp.task('img', function () {
    gulp.src(app.srcPath + 'imgs/**')
        .pipe(gulp.dest(app.buildPath + 'imgs'));
})

gulp.task('json', function () {
    gulp.src(app.srcPath + 'data.json')
        .pipe(gulp.dest(app.buildPath))
})

gulp.task('html', function () {
    gulp.src(app.srcPath + 'index.html')
        .pipe(gulp.dest(app.buildPath))
        .pipe(browserSync.stream());
})

gulp.task('inject', function () {
    var target = gulp.src(app.srcPath + 'index.html');
    var jquerySrc = app.buildPath + 'libs/jquery.js';
    var assets = gulp.src([
        '!' + jquerySrc,
        app.buildPath + 'libs/**',
        app.buildPath + 'js/' + app.jsFile,
        app.buildPath + 'css/' + app.cssFile
    ], { read: false });

    target
        .pipe($.inject(gulp.src(jquerySrc, { read: false }), { name: 'jquery', ignorePath: app.buildPath, addRootSlash: false, removeTags: true }))
        .pipe($.inject(assets, {
            ignorePath: app.buildPath,
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(gulp.dest(app.buildPath));
})

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: app.buildPath,
            browser: 'chrome',
            ui: {
                port: 5000
            }
        }
    });

    gulp.watch(app.srcPath + 'css/*', ['css']);
    gulp.watch(app.srcPath + 'js/*', ['js']);
    gulp.watch(app.srcPath + 'imgs/*', ['img']);
    gulp.watch(app.srcPath + 'libs/*', ['libs']);
    gulp.watch(app.srcPath + 'index.html', ['inject']);
    gulp.watch(app.srcPath + 'data.json', ['json']);

    gulp.watch(app.srcPath + 'index.html').on('change', browserSync.reload);
    gulp.watch(app.srcPath + 'css/*').on('change', browserSync.reload);
    gulp.watch(app.srcPath + 'js/*').on('change', browserSync.reload);
    gulp.watch(app.srcPath + 'imgs/*').on('change', browserSync.reload);
    gulp.watch(app.srcPath + 'libs/*').on('change', browserSync.reload);
});

gulp.task('build', function (cb) {
    runSequence(['js', 'css', 'img','json', 'lib'], 'inject', 'serve', cb);
});


gulp.task('clean', function () {
    gulp.src([app.buildPath + 'css', app.buildPath + 'js', app.buildPath + 'imgs'], { read: false })
        .pipe($.clean());
});

gulp.task('default', ['build']);