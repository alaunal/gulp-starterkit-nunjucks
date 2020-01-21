  /*
   *
   * A simple Gulp 4 Starter Kit
   *
   * @author A.kauniyyah <a.kauniyyah@go-jek.com>
   * @copyright 2019 A.kauniyyah | Sr. Front-end Web developer
   *
   * ________________________________________________________________________________
   *
   * gulpfile.js
   *
   * The gulp task runner file.
   *
   */

  // -- General 
  const gulp = require('gulp');
  const del = require('del');
  const fs = require('fs');
  const header = require('gulp-header');
  const changed = require('gulp-changed');
  const newer = require('gulp-newer');
  const concat = require('gulp-concat');
  const sourcemaps = require('gulp-sourcemaps');
  const noop = require('gulp-noop');
  const debug = require('gulp-debug');
  const cache = require('gulp-cached');
  const pump = require('pump');
  const runSequence = require('gulp4-run-sequence');
  const directoryExists = require('directory-exists');

  // -- config
  const package = require('./package.json');
  const config = require('./gulpfile.config');
  const pathConf = require('./path.config');

  // -- Styles
  const sass = require('gulp-sass');
  const postcss = require('gulp-postcss');
  const autoprefixer = require('gulp-autoprefixer');
  const cssnano = require('cssnano');
  const csso = require('gulp-csso');
  const cleanCss = require('gulp-clean-css');

  // -- HTML templates nunjuncks
  const nunjucksRender = require('gulp-nunjucks-render');
  const browserSync = require('browser-sync').create();
  const beautify = require('gulp-jsbeautifier');
  const data = require('gulp-data');

  // -- scripts
  const terser = require('gulp-terser');
  const optimizejs = require('gulp-optimize-js');
  const plumber = require('gulp-plumber');
  const babel = require('gulp-babel');
  const strip = require('gulp-strip-comments');


  // ---------------------------------------------------
  // -- FUNCTION OF HELPERS
  // ---------------------------------------------------

  // -- Environment configuration.

  const isProd = process.env.NODE_ENV === 'production';

  // ---------------------------------------------------
  // -- GULP TASKS
  // ---------------------------------------------------

  // -- clean of build dir

  gulp.task('clean', () => del([config.paths.build]));

  // -- clean of cache

  gulp.task('clear-cache', done => {
      cache.caches = {};

      done();
  });

  // -- Run Server setups

  gulp.task('runServer', () => {
      return browserSync.init({
          server: {
              baseDir: ['build']
          },
          port: 8080,
          open: true
      });
  });

  // -- Scss of styles task runner compile

  gulp.task('compile-styles', done => {

      if (!config.settings.styles) return done();

      pump([
          gulp.src([config.paths.styles.input]),
          (isProd ? noop() : changed(config.paths.styles.output, {
              extension: '.css'
          })),
          (isProd ? noop() : sourcemaps.init()),
          sass({
              outputStyle: 'compressed'
          }).on('error', sass.logError),
          autoprefixer(),
          postcss([
              cssnano({
                  discardComments: {
                      removeAll: true
                  }
              })
          ]),
          csso(),
          cleanCss(),
          (isProd ? noop() : sourcemaps.write('../maps')),
          header(config.header.main, {
              package: package
          }),
          gulp.dest(config.paths.styles.output)
      ]);

      done();
  });

  // -- Scripts js vendors, global, & apps old version

  gulp.task('compile-js-vendor', done => {

      if (!config.settings.scripts) return done();

      const VENDORS_LIBS = [
          config.paths.scripts.dir + 'vendors/jquery.js',
          //   config.paths.scripts.dir + 'vendors/lazyload.min.js',
          //   config.paths.scripts.dir + 'vendors/slick.min.js',
          config.paths.scripts.dir + 'vendors/parsley.js',
      ];

      pump([
          gulp.src(VENDORS_LIBS),
          plumber(),
          (isProd ? noop() : newer(config.paths.scripts.output + 'libs.js')),
          (isProd ? noop() : sourcemaps.init()),
          babel(),
          concat('libs.js'),
          terser(isProd ? config.uglify.prod : config.uglify.dev),
          optimizejs(),
          strip(),
          (isProd ? noop() : sourcemaps.write('../maps')),
          header(config.header.main, {
              package: package
          }),
          gulp.dest(config.paths.scripts.output)
      ]);

      done();
  });

  gulp.task('compile-js-global', done => {

      if (!config.settings.scripts) return done();

      pump([
          gulp.src(config.paths.scripts.dir + '/global/*.js'),
          plumber(),
          (isProd ? noop() : newer(config.paths.scripts.output + 'global.js')),
          (isProd ? noop() : sourcemaps.init()),
          babel(),
          concat('global.js'),
          terser(isProd ? config.uglify.prod : config.uglify.dev),
          optimizejs(),
          strip(),
          (isProd ? noop() : sourcemaps.write('../maps')),
          header(config.header.main, {
              package: package
          }),
          gulp.dest(config.paths.scripts.output)
      ]);

      done();
  });

  gulp.task('compile-js-app', done => {

      if (!config.settings.scripts) return done();

      pump([
          gulp.src(config.paths.scripts.dir + 'apps/*.js'),
          plumber(),
          (isProd ? noop() : changed(config.paths.scripts.output, {
              extension: '.js'
          })),
          (isProd ? noop() : sourcemaps.init()),
          babel(),
          terser(isProd ? config.uglify.prod : config.uglify.dev),
          optimizejs(),
          strip(),
          (isProd ? noop() : sourcemaps.write('../maps')),
          header(config.header.main, {
              package: package
          }),
          gulp.dest(config.paths.scripts.output)
      ]);

      done();
  });

  // -- Nunjucks html template compile 

  gulp.task('compile-html', done => {

      if (!config.settings.copy) return done();

      return gulp.src(config.paths.public.input)
          .pipe(
              changed(config.paths.build, {
                  extension: '.html'
              })
          )
          .pipe(plumber())
          .pipe(data(function() {
              return JSON.parse(fs.readFileSync(config.paths.public.data));
          }))
          .pipe(nunjucksRender({
              path: [config.paths.html]
          }))
          .pipe(beautify({
              html: {
                  indent_size: 2,
                  indent_char: ' ',
                  max_preserve_newlines: 1
              }
          }))
          .pipe(gulp.dest(config.paths.build))
          .pipe(browserSync.stream());

  });

  // -- Copy of static when of changed

  gulp.task('copy-static', () => {
      return gulp.src(config.paths.libs + '**/*')
          .pipe(gulp.dest(config.paths.output));
  });

  // -- Merge of static build to Portal Project

  gulp.task('merge-static', done => {
    const directory = pathConf.paths.outroot + '' + pathConf.paths.dir_toCopy;

    directoryExists(directory, (error, result) => {
        if (result) {
            return gulp.src(config.paths.output + '**/*')
                .pipe(gulp.dest(directory));
        }
    });

    done();
});

  // -- Compile task runner

  gulp.task('gulp:compile', function(callback) {
      runSequence(
          'clear-cache',
          'compile-styles',
          [
              'compile-js-vendor',
              'compile-js-global',
              'compile-js-app'
          ],
          'copy-static',
          'compile-html',
          callback
      );
  });

  // -- Merge task runner

  gulp.task('gulp:merge', function(callback) {
    runSequence(
        'clean',
        'clear-cache',
        'gulp:compile',
        'merge-static',
        callback
    );
});

  // -- watch task runner

  gulp.task('gulp:watch', () => {
      const watch = [
          config.paths.styles.dir,
          config.paths.scripts.dir,
          config.paths.html
      ];

      gulp.watch(watch, gulp.series('gulp:compile')).on('change', browserSync.reload);
  });

  // -- task serve

  gulp.task('gulp:serve', gulp.series('gulp:compile', 'copy-static', gulp.parallel('runServer', 'gulp:watch')));

  // -- task default

  gulp.task('default', gulp.series('gulp:compile', gulp.parallel('runServer')));