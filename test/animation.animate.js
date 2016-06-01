var expect = require('chai').expect;

var animate = require('../src/animation/animate.js');

describe('animate.js', function() {
    describe('#animate', function() {
        it('should have a default delay of 30fps', function() {
            expect(animate(function() {})._idlePrev.msecs).to.equal((1/30)*1000);
        });

        it('should not have a next', function() {
            expect(animate(function() {}, {
                fps: 0
            })._idleNext.msecs).to.equal(undefined);
        });
    });
});