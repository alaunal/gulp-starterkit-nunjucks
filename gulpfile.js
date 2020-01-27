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
  const siteConf = require('./site.config');

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
  const rollup = require('gulp-better-rollup');
  const rollupBabel = require('rollup-plugin-babel');
  const rollupMinify = require('rollup-plugin-babel-minify');
  const rollupResolve = require('@rollup/plugin-node-resolve');
  const rollupCommonjs = require('@rollup/plugin-commonjs');


  // ---------------------------------------------------
  // -- FUNCTION OF HELPERS
  // ---------------------------------------------------

  // -- Environment configuration.

  const isProd = process.env.NODE_ENV === 'production';


  // -- fetch command line arguments

  const arg = (argList => {
      let arg = {},
          a, opt, thisOpt, curOpt;
      for (a = 0; a < argList.length; a++) {
          thisOpt = argList[a].trim();
          opt = thisOpt.replace(/^\-+/, '');
          if (opt === thisOpt) {
              if (curOpt) arg[curOpt] = opt;
              curOpt = null;
          } else {
              curOpt = opt;
              arg[curOpt] = true;
          }
      }
      return arg;
  })(process.argv);

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
          port: arg.port ? Number(arg.port) : 8080,
          open: true
      });
  });
  

  // -- Scss of styles task runner compile

  gulp.task('compile-styles', done => {

      if (!config.settings.styles) return done();

      pump([
          gulp.src([config.paths.styles.input]),
          plumber(),
        //   (isProd ? noop() : changed(config.paths.styles.output, {
        //       extension: '.css'
        //   })),
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
          gulp.dest(config.paths.styles.output),
          browserSync.stream()
      ]);

      done();
  });

  // -- Script js use rollup

  gulp.task('scripts-compile', done => {

      if (!config.settings.scripts) return done();

      const rollupPugins = [
          rollupResolve({
              browser: true,
          }),
          rollupCommonjs(),
          rollupBabel({
              exclude: './node_modules/**'
          })
      ];

      return gulp.src(config.paths.scripts.dir + '*.js')
          .pipe(isProd ? noop() : sourcemaps.init())
          .pipe(plumber())
        //   .pipe((isProd ? noop() : changed(config.paths.scripts.output, {
        //       extension: '.js'
        //   })))
          .pipe(rollup({
              plugins: rollupPugins
          }, {
              format: 'iife',
              name: 'scripts'
          }))
          //   .pipe(babel())
          .pipe(terser(isProd ? config.uglify.prod : config.uglify.dev))
          .pipe(optimizejs())
          .pipe(strip())
          .pipe((isProd ? noop() : sourcemaps.write('../maps')))
          .pipe(header(config.header.main, {
              package: package
          }))
          .pipe(gulp.dest(config.paths.scripts.output))
          .pipe(browserSync.stream());

  });

  // -- Nunjucks html template compile 

  gulp.task('compile-html', done => {

      if (!config.settings.copy) return done();

      return gulp.src(config.paths.public.input)
          .pipe(plumber())
          .pipe(data(function() {
              return siteConf.data;
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

      const pathConf = require('./path.config');
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
          'scripts-compile',
          'copy-static',
          'compile-html',
          callback
      );
  });

  // -- Merge task runner

  gulp.task('gulp:merge', function(callback) {
      runSequence(
          'clean',
          'gulp:compile',
          'merge-static',
          callback
      );
  });

  // -- watch task runner

  gulp.task('gulp:watch', done => {
      gulp.watch(config.paths.src, gulp.series('gulp:compile')).on('change', browserSync.reload);

      done();
  });

  // -- task serve

  gulp.task('gulp:serve', gulp.series('gulp:compile', gulp.parallel('runServer', 'gulp:watch')));

  // -- task default

  gulp.task('default', gulp.series('clean', 'gulp:compile'));