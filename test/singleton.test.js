import path from 'path';
import gulp from 'gulp';
import {expect} from 'chai';
import GulpDest from '../src/gulpdest';
import GulpGlob from 'gulpglob';
import {tmpDir} from 'cleanup-wrapper';

describe('GulpDest is singleton class', function () {
  it(`Instance returned by ctor is a singleton`, function () {
    const g1 = new GulpDest('build1');
    const g2 = new GulpDest('build2');

    const g3 = new GulpDest('build1');
    const g4 = new GulpDest(path.join(process.cwd(), 'build1'));

    expect(g1).not.to.equal(g2);
    expect(g1).to.equal(g3);
    expect(g1).to.equal(g4);

    const g5 = new GulpDest(g1);

    expect(g1).to.equal(g5);
  });

  it(`Instance returned by 'dest' method is a singleton`, tmpDir([
    'build1'], function () {
    const glob1 = 'src/**/*.js';
    const glob2 = 'test/**/*.js';
    const glob3 = ['src/**/*.js', 'test/**/*.js'];
    const glob4 = path.join(process.cwd(), 'src/**/*.js');

    const stream1 = gulp.src(glob1);
    const stream2 = gulp.src(glob2);
    const stream3 = gulp.src(glob3);
    const stream4 = gulp.src(glob4);

    const dest = new GulpDest('build1');

    const g1 = dest.dest(stream1, {glob: glob1});
    const g2 = dest.dest(stream2, {glob: glob2});
    const g3 = dest.dest(stream3, {glob: glob3});
    const g4 = dest.dest(stream4, {glob: glob4});

    expect(g1).not.to.equal(g2);
    expect(g1).not.to.equal(g3);
    expect(g1).to.equal(g4);

    return Promise.all([g1, g2, g3, g4].map(g => g.toPromise())).then(ggs => {
      const [_g1, _g2, _g3, _g4] = ggs;

      const gg1 = new GulpGlob([glob1, {cwd: 'build1', base: 'build1'}]);
      const gg2 = new GulpGlob([glob2, {cwd: 'build1', base: 'build1'}]);
      const gg3 = new GulpGlob([glob3, {cwd: 'build1', base: 'build1'}]);

      expect(gg1).to.equal(_g1);
      expect(gg2).to.equal(_g2);
      expect(gg3).to.equal(_g3);
      expect(gg1).to.equal(_g4);
    });
  }));
});
