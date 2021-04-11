/**
 *
 * @author A.kauniyyah <a.kauniyyah@go-jek.com>
 * @copyright 2019 A.kauniyyah | Sr. Front-end Web developer
 *
 * ________________________________________________________________________________
 *
 * gulpfile.config.js
 *
 * The gulp configuration file.
 *
 */

 // -- Settings | Turn on/off build features

const SETTINGS = {
    clean: true,
    scripts: true,
    styles: true,
    copy: true,
    public: true,
    pwa: true,
    reload: true
};

// -- Header Template | Append of header in script js or css

const BANNERS = {
    main: '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | <%= package.license %> License' +
        ' | author <%= package.author %>' +
        ' */\n'
};

// -- Uglify setup | setup of dev or prod env build

const UGLIFY = {
  prod: {
      compress: {
          drop_console: true,
          drop_debugger: true
      }
  },
  dev: {
      compress: {
          drop_console: false,
          drop_debugger: false
      }
  }
};


// -- type format script or rollupjs | option: [es, cjs, amd, system]

const FORMAT_SCRIPT = 'es';


// -- path config | setup of path src or dist file

const SRC = './src/';
const BUILD = './build/';
const STATIC = BUILD + 'static/';
const ASSETS = SRC + 'assets/';
const LIBS = SRC + 'libs/';
const HTML = SRC + 'public/';

const PATHS = {
    output: STATIC,
    input: ASSETS,
    libs: LIBS,
    build: BUILD,
    html: HTML,
    src: SRC,
    styles: {
        dir: ASSETS + 'scss/',
        input: ASSETS + 'scss/*.scss',
        output: STATIC + 'css/'
    },
    scripts: {
        dir: ASSETS + 'js/',
        input: ASSETS + 'js/',
        output: STATIC + 'js/',
        outputNomodule: STATIC + 'js/nomodule/'
    },
    public: {
        input: [
            HTML + 'pages/**/*.html',
            '!' + HTML + 'templates/**'
        ],
        output: BUILD,
        data: './site.config',
    },
    pwa: {
      dir: ASSETS + 'pwa/'
  },
};


// -- bundle config | all for export

module.exports = {
    paths: PATHS,
    uglify: UGLIFY,
    header: BANNERS,
    settings: SETTINGS,
    formatScript: FORMAT_SCRIPT
};
