var Loader = require('../');
var Q = require('q');
var path = require('path');
var expect  = require('expect.js');

describe('index', function() {

    var loader = new Loader([
        process.cwd(),
        path.join(process.cwd(), 'test')
    ]);

    describe('#resolve', function() {

        it('resolves path to file', function() {
            expect( loader.resolve( 'test/assets/a.txt' ) )
            .to.be( path.join(process.cwd(), 'test/assets/a.txt') );
        });

        it('resolves path to file', function() {
            expect( loader.resolve( 'assets/a.txt' ) )
            .to.be( path.join(process.cwd(), 'test/assets/a.txt') );
        });

        it('resolves path to directory', function() {
            expect( loader.resolve( 'test/assets', undefined, dir = true ) )
            .to.be( path.join(process.cwd(), 'test/assets') );
        });

    });

    describe('#load', function() {

        it('reads the resolved file sync', function() {
            expect( loader.load( 'test/assets/a.txt' ) )
            .to.be.a('string');
        });

        it('reads the resolved file async', function() {
            return Q.Promise(function(resolve, reject) {
                loader.load( 'test/assets/a.txt', function(err, data) {
                    if (err) return reject(err);
                    resolve(data);
                });
            })
            .then(function(data) {
                expect(data).to.be.a('string');
            });
        });

    });

});