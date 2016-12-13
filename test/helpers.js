import path from 'path';
import gulp from 'gulp';
import diff from 'gulp-diff';
import {noop} from 'gulp-util';
import streamToPromise from 'stream-to-promise';

export function validArgs() {
  return [
    'build1',
    path.join(process.cwd(), 'build2'),
    '/tmp/gulpdest-' + (new Date()).getTime()
  ];
};

export function invalidArgs() {
  return [
    '',
    [],
    ['gulpfile.babel.js', ''],
    {},
    42
  ];
};

export function equalFileContents(glb, dest, pipe = noop) {
  return streamToPromise(gulp.src(glb, {base: process.cwd()})
    .pipe(pipe())
    .pipe(diff(dest))
    .pipe(diff.reporter({fail: true})));
};
