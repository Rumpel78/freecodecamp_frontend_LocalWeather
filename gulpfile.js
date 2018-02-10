/*eslint-disable */
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');


var rollup = require('rollup');
var babel = require('rollup-plugin-babel');

var browserSync = require('browser-sync');

var compressJs = require('gulp-uglify');
var compressCss = require('gulp-cssnano');
var pngquant = require('imagemin-pngquant');
var imagemin = require('gulp-imagemin');

var rimraf = require('gulp-rimraf');

var sass = require('gulp-sass');

var concat = require('gulp-concat');
var replace = require('gulp-replace');
var config = require('./package.json')

var reload = browserSync.reload;


// DEPLOY
var rsync = require('gulp-rsync');

gulp.task('deploy', function() {

  // Default options for rsync
  var rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
	  chmod: "ugo=rwX",
    exclude: [],
		root:'build/',
    compress: true,
    hostname: config.rsync.hostname,
    username: config.rsync.username,
    destination: config.rsync.destination
  };
  return gulp.src('build/**', {base:'build'})
             .pipe(rsync(rsyncConf));
});

// DEPLOY END

// Browser
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    files: ['./build/**/*.*'],
    port: 5000,
  });
});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['build:js:main']);
  gulp.watch('src/css/**/*.css', ['build:css']);
  gulp.watch('src/css/**/*.scss', ['build:css']);
  gulp.watch('src/*.html', ['build:html:dev']);
  gulp.watch('src/assets/**/*', ['move:assets']);
});

// Javascript MAIN
gulp.task('build:js:main', function() {
 return rollup.rollup({
   entry: './src/js/index.js',
   plugins: [
		 babel({ runtimeHelpers: true })
	 ]
 }).then( function ( bundle ) {
   bundle.write({
     format: 'iife',
     sourceMap: true,
     dest: './build/js/main.js'
   });
   browserSync.reload();
 });
});

// Javascript VENDOR
gulp.task('build:js:vendor', () => {
  return gulp.src(config.dirs.js)
    .pipe(concat('vendor.js'))
    .pipe(compressJs())
    .pipe(gulp.dest('build/js'));
});

// COMPRESSION
gulp.task('compress:js', ['clean:map'], function() {
  return gulp.src('build/js/*.js')
    .pipe(compressJs())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('compress:css', function() {
  return gulp.src('build/css/*.css')
    .pipe(compressCss())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('compress:images', function() {
    return gulp.src('build/assets/*.{jpg,jpeg,gif,svg,png}')
      .pipe(imagemin())
      .pipe(gulp.dest('./build/css'));
  });

// HTML
var envReplace = function (env) {
  return gulp.src(['src/index.html'])
    .pipe(replace('__REPLACE_ENV__', env))
    .pipe(gulp.dest('./build'));
}

gulp.task('build:html:dev', function() {
  return envReplace('development');
});

gulp.task('build:html:dist', function() {
  return envReplace('production');
});

// CSS
gulp.task('build:css', function() {
  return gulp.src(['./src/css/**/*.css','./src/css/**/*.scss'])
  .pipe(sass({outputStyle: 'expanded', includePaths: config.dirs.sass}).on('error', sass.logError))
  .pipe(gulp.dest('build/css'))
  .pipe(reload({stream:true}));
});

// Assets
gulp.task('move:assets', function() {
  return gulp.src('./src/assets/**/*')
  .pipe(gulp.dest('./build/assets'))
  .pipe(reload({stream:true}));
});

// Clean
gulp.task('clean', function() {
   return gulp.src('./build/*', { read: false })
		.pipe(rimraf({ force: true }));
});

gulp.task('clean:map', function () {
  return gulp.src('./build/js/*.js.map', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('move', ['move:assets']);
gulp.task('build', ['build:js:main', 'build:js:vendor', 'build:css', 'move']);
gulp.task('compress', ['compress:js', 'compress:css']);

gulp.task('default', gulpSequence('clean', ['build:html:dev', 'build'], 'browser-sync', 'watch'));
gulp.task('dist', gulpSequence('clean', ['build:html:dist', 'build'], 'compress'));
