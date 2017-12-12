var gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    glob = require('glob'),
    es = require('event-stream');

gulp.task('browserifyAndes6', function(done) {
    var jsSrcArr = './es6/*.js';
    glob(jsSrcArr, function(err, files) {
        if(err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(buffer())
                .pipe(babel({presets:['es2015']}))
                .pipe(rename({
                    extname: '.bundle.js',
                    dirname : ''
                }))
                .pipe(gulp.dest('build'));
        });
        es.merge(tasks).on('end', done);
    })
});
gulp.task('watchJS',function(){
    gulp.watch('./es6/*.js',['browserifyAndes6'])
});
gulp.task('taskLESS',function(){
    gulp.src('./less/*.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('./css'))
});
gulp.task('watchLESS',function(){
    gulp.watch('./less/*.less',['taskLESS'])
});
gulp.task('default',['watchJS','watchLESS','browserifyAndes6','taskLESS']);
