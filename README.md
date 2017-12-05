# gulpdest
A wrapper around gulp.dest to make recycling patterns easier

## Usage

`gulp.dest` writes input stream to a destination. `GulpDest` does the
same but returns a `GulpGlob` object, making it easy to work with the new files (see package [gulpglob](https://www.npmjs.com/package/gulpglob)).

```js
import GulpDest from 'gulpdest';
import gulp from 'gulp';

const dest = new GulpDest('build');
const glob = 'src/**/*.js';
const stream = gulp.src(glob, {base: process.cwd()});

const gg = dest.dest(stream, {glob}); // Writes stream to 'build' and returns a GulpGlob object
gg.list(); // Lists the new files
gg.src(); // Sources the new files
```

## License

gulpdest is [MIT licensed](./LICENSE).

© 2016-2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
