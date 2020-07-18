const fs = require('fs');

const rollupBabel = require('rollup-plugin-babel');
const rollupResolve = require('@rollup/plugin-node-resolve');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const cleanup = require ('rollup-plugin-cleanup');
const {
    terser
} = require('rollup-plugin-terser');

// -- config
const config = require('./gulpfile.config');

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

const isProd = arg.environment === 'production';

// -- filter Input file js

const inputFile = () => {
    const rawFiles = fs.readdirSync(config.paths.scripts.input);
    let inputFile = [];

    for (let index = 0; index < rawFiles.length; index++) {
        if (rawFiles[index] !== 'modules') {
            inputFile.push(config.paths.scripts.input + rawFiles[index]);
        }
    }

    return inputFile;
};


export default {
    plugins: [
        rollupResolve({
            browser: true,
        }),
        rollupCommonjs(),
        rollupBabel({
            exclude: 'node_modules/**'
        }),
        cleanup({
          comments: 'none'
        })
    ],
    input: inputFile(),
    output: [
        // ES module version, for modern browsers
        {
            dir: config.paths.scripts.output,
            format: "es",
            sourcemap: isProd ? false : true,
            plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
        },
        // SystemJS version, for older browsers
        {
            dir: config.paths.scripts.outputNomodule,
            format: "system",
            sourcemap: isProd ? false : true,
            plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
        }
    ]
};
