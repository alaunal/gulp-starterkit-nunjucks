  /*
   *
   * A simple Gulp 4 Starter Kit
   *
   * @author A.kauniyyah <alaunalkauniyyah3@gmail.com>
   * @copyright 2019 A.kauniyyah | Front-end Web developer
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
  const sourcemaps = require('gulp-sourcemaps');
  const noop = require('gulp-noop');
  const plumber = require('gulp-plumber');
  const pump = require('pump');
  const runSequence = require('gulp4-run-sequence');
  const directoryExists = require('directory-exists');
  const gulpRun = require('gulp-run-command').default;

  // -- config
  const package = require('./package.json');
  const config = require('./gulpfile.config');

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

  // -- Scripts rollup.js
  const { rollup } = require('rollup');
  const rollupBabel = require('rollup-plugin-babel');
  const rollupResolve = require('@rollup/plugin-node-resolve');
  const rollupCommonjs = require('@rollup/plugin-commonjs');
  const { terser } = require('rollup-plugin-terser');
  const rollupCleanup = require('rollup-plugin-cleanup');


  // ---------------------------------------------------
  // -- FUNCTION OF HELPERS
  // ---------------------------------------------------


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


  // -- Environment configuration.

  const isProd = arg.production === true;

  // ---------------------------------------------------
  // -- GULP TASKS
  // ---------------------------------------------------

  // -- clean of build dir

  gulp.task('clean', () => del(['./build']));

  // -- Run Server and reload setup

  gulp.task('runServer', () => {
      return browserSync.init({
          server: {
              baseDir: ['build']
          },
          port: arg.port ? Number(arg.port) : 8080,
          open: false
      });
  });

  gulp.task('reload', done => {
      browserSync.reload();
      done();
  });


  // -- Scss of styles task runner compile

  gulp.task('compile-styles', done => {

      if (!config.settings.styles) return done();

      pump([
          gulp.src(config.paths.styles.input),
          plumber(),
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
          cleanCss(cleanCss({
              level: {
                  1: {
                      specialComments: 0
                  }
              }
          })),
          (isProd ? noop() : sourcemaps.write('./maps')),
          header(config.header.main, {
              package: package
          }),
          gulp.dest(config.paths.styles.output)
      ]);

      done();
  });

  // -- Script js use rollup

  gulp.task('compile-scripts', done => {
    if (!config.settings.scripts) return done();

    const inputFile = () => {
      const dir = config.paths.scripts.dir;
      const rawFiles = fs.readdirSync(dir);
      let inputFile = [];


      rawFiles.forEach(function(file) {
          file = dir + '' + file;
          let stat = fs.statSync(file);

          if (stat && !stat.isDirectory()) {
              inputFile.push(file);
          }
      });

      return inputFile;
    };

    const rollupSet = rollup({
      input: inputFile(),
      plugins: [
          rollupResolve({
              browser: true,
          }),
          rollupCommonjs(),
          rollupBabel({
              exclude: 'node_modules/**'
          }),
          rollupCleanup({
              comments: 'none'
          })
      ]
    });

    const outputSet = {
      chunkFileNames: 'module-[name].js',
      sourcemap: isProd ? false : true,
      plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
    };

    return (
      rollupSet.then(bundle => {
          return bundle.write(Object.assign({
              dir: config.paths.scripts.output,
              format: 'es'
          }, outputSet));
      }),
      rollupSet.then(bundle => {
          return bundle.write(Object.assign({
              dir: config.paths.scripts.outputNomodule,
              format: 'system'
          }, outputSet));
      })
    );
  });

  // -- Nunjucks html template compile

  gulp.task('compile-html', done => {

      if (!config.settings.public) return done();

      const siteConf = require(config.paths.public.data);

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
          .pipe(gulp.dest(config.paths.build));

  });

  // -- Copy of static when of changed

  gulp.task('copy-static', () => {
      if (!config.settings.copy) return done();

      return gulp.src(config.paths.libs + '**/*')
          .pipe(gulp.dest(config.paths.output));
  });


  gulp.task("service-worker", function() {

      if (!config.settings.pwa) return done();

      return gulp.src(config.paths.pwa.dir + '**/*')
          .pipe(gulp.dest(config.paths.build));
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
          'compile-styles',
          'compile-scripts',
          'copy-static',
          'service-worker',
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

  gulp.task('gulp:watch', () => {
      gulp.watch(config.paths.src, callback => {
          runSequence(
              'gulp:compile',
              'reload',
              callback
          );
      });
  });

  // -- task serve

  gulp.task('gulp:serve', (callback) => {
      runSequence(
          'gulp:compile',
          [
              'runServer', 'gulp:watch'
          ],
          callback
      );
  });

  // -- task default

  gulp.task('default', gulp.series('clean', 'gulp:compile'));
