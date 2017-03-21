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
    expect(g1.at(0)).not.to.equal(g2.at(0));

    const g5 = new GulpDest('build1', 'build2');

    expect(g1).not.to.equal(g5);
    expect(g5.length).to.equal(2);
    expect(g1.at(0)).to.equal(g5.at(0));
    expect(g1.at(0)).not.to.equal(g5.at(1));
    expect(g2.at(0)).to.equal(g5.at(1));

    const g6 = new GulpDest('build1', path.join(process.cwd(), 'build1'));

    expect(g6.length).to.equal(1);
    expect(g1.at(0)).to.equal(g6.at(0));
    expect(g1.at(0)).not.to.equal(g6.at(1));
    expect(g1).to.equal(g6);

    const g7 = new GulpDest(g1);
    const g8 = new GulpDest(g1, g2);
    const g9 = new GulpDest(g2, g1);

    expect(g1).to.equal(g7);
    expect(g5).to.equal(g8);
    expect(g5).to.equal(g9);
  });

  it(`Instance returned by 'dest' method is a singleton`, tmpDir(['build1',
    'build2'], function () {
    const glob1 = 'src/**/*.js';
    const glob2 = 'test/**/*.js';
    const glob3 = ['src/**/*.js', 'test/**/*.js'];
    const glob4 = path.join(process.cwd(), 'src/**/*.js');

    const stream1 = gulp.src(glob1);
    const stream2 = gulp.src(glob2);
    const stream3 = gulp.src(glob3);
    const stream4 = gulp.src(glob4);

    const dest = new GulpDest('build1', 'build2');

    const g1 = dest.dest(stream1, glob1);
    const g2 = dest.dest(stream2, glob2);
    const g3 = dest.dest(stream3, glob3);
    const g4 = dest.dest(stream4, glob4);

    expect(g1).not.to.equal(g2);
    expect(g1).not.to.equal(g3);
    expect(g1).to.equal(g4);

    expect(g1.at(0)).not.to.equal(g2.at(0));
    expect(g1.at(1)).not.to.equal(g2.at(1));
    expect(g1.at(0)).not.to.equal(g3.at(0));
    expect(g1.at(1)).not.to.equal(g3.at(1));
    expect(g1.at(0)).to.equal(g4.at(0));
    expect(g1.at(1)).to.equal(g4.at(1));

    return Promise.all([g1, g2, g3, g4].map(g => g.toPromise())).then(ggs => {
      const [_g1, _g2, _g3, _g4] = ggs;
      expect(_g1[0]).to.equal(g1.at(0));
      expect(_g1[1]).to.equal(g1.at(1));
      expect(_g2[0]).to.equal(g2.at(0));
      expect(_g2[1]).to.equal(g2.at(1));
      expect(_g3[0]).to.equal(g3.at(0));
      expect(_g3[1]).to.equal(g3.at(1));
      expect(_g4[0]).to.equal(g4.at(0));
      expect(_g4[1]).to.equal(g4.at(1));

      const gg1 = new GulpGlob('build1/src/**/*.js');
      const gg2 = new GulpGlob('build2/src/**/*.js');
      const gg3 = new GulpGlob('build1/test/**/*.js');
      const gg4 = new GulpGlob('build2/test/**/*.js');
      expect(gg1.at(0)).to.equal(_g1[0]);
      expect(gg2.at(0)).to.equal(_g1[1]);
      expect(gg3.at(0)).to.equal(_g2[0]);
      expect(gg4.at(0)).to.equal(_g2[1]);
    });
  }));
});
