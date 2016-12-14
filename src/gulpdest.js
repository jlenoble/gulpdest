import SimpleGulpDest from './simple-gulpdest';
import {PolytonFactory} from 'polyton';
import GulpGlob from 'gulpglob';
import path from 'path';
import isString from 'is-string';

const GulpDest = PolytonFactory(SimpleGulpDest, ['literal'], [{
  unordered: true,
}], {
  preprocess: function (args) {
    let preArgs = [];
    args.forEach(dest => {
      let dst = dest[0];
      if (dest.length !== 1) {
        dst = dest;
      }
      if (isString(dst) && dst !== '') {
        dst = path.relative(process.cwd(), dst);
        if (!preArgs.includes(dst)) {
          preArgs.push(dst);
        }
      } else {
        throw new TypeError('Invalid dest element: "' + dst + '"');
      }
    });
    return preArgs.map(arg => [arg]);
  },
  properties: {
    destination: {
      get () {
        return [[], ...this.map(el => el.destination)].reduce(
          (array, dest) => array.concat(dest));
      },
    },
  },
  extend: {
    dest (stream, glob) {
      const cwd = process.cwd();
      let glb = Array.isArray(glob) ? glob : [glob];
      glb = glb.map(gl => path.relative(cwd, gl));

      return new GulpGlob(...this.map(dest =>
        dest._globArgs(stream, glb)));
    },
  },
});

export default GulpDest;
