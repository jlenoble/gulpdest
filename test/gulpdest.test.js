import Muter, {captured} from 'muter';
import {expect} from 'chai';
import Gulpdest from '../src/gulpdest';

describe('Testing Gulpdest', function() {

  const muter = Muter(console, 'log');

  it(`Class Gulpdest says 'Hello!'`, captured(muter, function() {
    new Gulpdest();
    expect(muter.getLogs()).to.equal('Hello!\n');
  }));

});
