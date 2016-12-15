import path from 'path';
import gulp from 'gulp';
import diff from 'gulp-diff';
import {noop} from 'gulp-util';
import streamToPromise from 'stream-to-promise';

export function validArgs() {
  return [
    'tmp',
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
