var gulp = require('gulp');
//var ts = require('gulp-typescript');
var tsc = require('gulp-tsc');
//var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
//var mainNpmFiles = require('gulp-main-npm-files');
//var nodeInspector = require('gulp-node-inspector');


//gulp.task('copyfiles', function () {
//    gulp.src('./sources/client/*/*.*')
//        .pipe(gulp.dest('./build/client'));
//    gulp.src('./sources/client/*.*')
//        .pipe(gulp.dest('./build/client'));
//});

// Copy dependencies to build/node_modules/ 
/*gulp.task('copy-npm-deps', function() {
    gulp.src(mainNpmFiles(), {base: './'})
        .pipe(gulp.dest('./build'));
}); */

gulp.task('compile', function () {
    /*var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
    
    return tsResult;*/
    gulp.src(['sources/server/*.ts'])
    .pipe(tsc({sourceMap: true, outDir: 'build/server'}))
    .pipe(gulp.dest('build/server'))
  });
  
gulp.task('watch', function() {
    gulp.watch('sources/*/*.*', ['compile']);
});

/*
gulp.task('inspect', function () {
    gulp.src([]).pipe(nodeInspector ({
        debugPort: 5859,
        webHost: '127.0.0.0',
        webPort: '8085',
        preload: false
    }));
});*/

// The default task (called when you run `gulp` from cli)
gulp.task('default', [ 'compile', 'watch'], function() {
    nodemon({
        script: 'build/server/rest-server.js',
        watch: ["sources/*/*.*"],
        ext: 'js',
        exec: 'node --inspect'
    })
    .on('restart', () => {
        gulp.src('rest-server.js').pipe(notify('Restarted server due to code change'));
    });
});