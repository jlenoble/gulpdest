import SimpleGulpDest from './simple-gulpdest';
import {PolytonFactory} from 'polyton';
import GulpGlob from 'gulpglob';
import path from 'path';

const GulpDest = PolytonFactory(SimpleGulpDest, ['literal'], undefined, {
  preprocess: function (args) {
    let preArgs = [];
    args.forEach(dest => {
      const dst = path.relative(process.cwd(), dest[0]);
      if (!preArgs.includes(dst)) {
        preArgs.push(dst);
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
