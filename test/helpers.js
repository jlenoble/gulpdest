import path from 'path';

export function validArgs () {
  return [
    'tmp',
    'build1',
    path.join(process.cwd(), 'build2'),
    '/tmp/gulpdest-' + (new Date()).getTime(),
  ];
};

export function invalidArgs () {
  return [
    '',
    [],
    ['gulpfile.babel.js', ''],
    {},
    42,
  ];
};
