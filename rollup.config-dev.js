const fs = require('fs');

const rollupBabel = require('rollup-plugin-babel');
const rollupResolve = require('@rollup/plugin-node-resolve');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

// -- config
const config = require('./gulpfile.config');

// -- filter Input file js

const inputFile = () => {
  const rawFiles = fs.readdirSync(config.paths.scripts.input);
  let inputFile = [];

  for (let index = 0; index < rawFiles.length; index++) {
    if(rawFiles[index] !== 'modules'){
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
        })
    ],
    input: inputFile(),
    output: [
        // ES module version, for modern browsers
        {
            dir: config.paths.scripts.output,
            format: "es",
            sourcemap: true,
            plugins: [terser(config.uglify.dev)],
        },
        // SystemJS version, for older browsers
        {
            dir: config.paths.scripts.outputNomodule,
            format: "system",
            sourcemap: true,
            plugins: [terser(config.uglify.dev)],
        }
    ]
};
