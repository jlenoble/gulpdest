import GulpDest from '../src/gulpdest';
import {expect} from 'chai';

describe('Testing edge cases', function () {
  it(`Instantiating GulpDest with no arguments`, function () {
    // Correct behavior for no args...
    expect(() => new GulpDest(undefined)).to.throw(TypeError,
      'Invalid dest element: "undefined"');

    // ... But with actual no args, instantiating used to throw:
    // TypeError: Cannot read property 'Symbol()' of undefined
    expect(() => new GulpDest()).to.throw(TypeError,
      'Invalid dest element: "undefined"');
  });
});
