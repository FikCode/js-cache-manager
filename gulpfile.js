import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { series, src, dest, watch } = require('gulp');
const rollup = require('gulp-rollup');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');

const destFolder = './dist';
const destNpmFolder = `${destFolder}/npm-package`;
const srcInput = './src/**/*.js';
const entryPoint = './src/CacheManager.js';

const destfilename = 'CacheManager'
const destFile = `${destFolder}/${destfilename}.js`;
const packageJson = 'package.json';
const readme = 'README.md';

function buildJS() {
  return src(srcInput)
    .pipe(rollup({
      input: entryPoint,
      output: {
        format: 'es',
        sourcemap: true,
      },
    }))
    .pipe(rename({ basename : destfilename }))
    .pipe(dest(destFolder));
}


function minify() {
  return src(destFile)
      .pipe(dest(destFolder))
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(dest(destFolder));
}

function generateNpmPackage(){
  return src([destFile, packageJson, readme])
      .pipe(dest(destNpmFolder));
}

let build = series(buildJS, minify, generateNpmPackage);
export { build }

export default function(){
  watch(['src/*.js', 'src/*/*.js'], { ignoreInitial: false }, build);
};