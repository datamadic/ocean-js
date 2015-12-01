var assert = require('assert'),
    ocean = require('../out/ocean.js').ocean();

describe('Ocean state interface', function() {

    describe('ocean: setting / getting state', function() {
        describe('update', function() {
            var uuid = ocean.update(function() {
                    return 5
                }),
                update = ocean.update(uuid, function(item) {
                    return ++item;
                }),
                got = ocean.getItem(uuid);

            // this is async??
            it('should return a uuid when initially setting state', function(done) {
                assert.equal(typeof uuid, 'string');
                done();
            });

            // this is async??
            it('should update a uuid\'s val, returning the updated value', function(done) {
                assert.equal(update, 6);
                done();
            });

            it('should return the value via getItem', function() {
                assert.equal(got, 6);
            });

            //todo: test types in and out...
        });
    });

    describe('ocean: dispatch / subscribe', function() {

        var ocean = require('../out/ocean.js').ocean();

        describe('subscribe', function() {


            it('should receive the event that was dispatched', function(done) {
                var unsub = ocean.subscribe('event 1', function(res) {
                    done();
                });

                // todo: should this have to be timed out???
                setTimeout(function() {
                    ocean.dispatch('event 1');
                }, 1);

            });
        });


        describe('subscribe', function() {

            it('should receive multiple dispatched items if sent', function(done) {
                var unsub = ocean.subscribe('event 2', function(first, second, third) {
                    assert.equal(first, 1);
                    assert.equal(second, 2);
                    assert.equal(third, 3);
                    done();
                });

                // todo: should this have to be timed out???
                setTimeout(function() {
                    ocean.dispatch('event 2', 1, 2, 3);
                });

            });
        });

        describe('unsubscribe', function() {
            var numGot = 0,
                sent = 0;

            this.timeout(500);

            it('should stop receiving messages after unsubscribing', function(done) {
                var unsub = ocean.subscribe('event 3', function() {
                    unsub();
                    ++numGot;
                });

                setTimeout(function() {
                    ocean.dispatch('event 3');
                    ++sent;
                });
                setTimeout(function() {
                    ocean.dispatch('event 3');
                    ++sent;
                });

                setTimeout(function() {
                    assert.equal(numGot, 1);
                    assert.equal(sent, 2);
                    done();
                }, 450);

            });
        });

        describe('compsub w/o state functions', function() {


            it('should be able to subscribe to multiple events in a compound way using \'and\'', function(done) {
                var numSent = 0;

                this.timeout(500);

                ocean.compsub('event 4 and event 5', function() {
                    if (numSent == 2) {
                        done();
                    }

                });

                setTimeout(function() {
                    ++numSent;
                    ocean.dispatch('event 4');

                }, 10);

                setTimeout(function() {
                    // todo: the numSent after the dispatch will break... need 
                    // to figure out if thats what I want... 
                    ++numSent;
                    ocean.dispatch('event 5');

                }, 200);

            });

            it('should be able to subscribe to multiple events in a compound way using \'or\'', function(done) {
                var numSent = 0;

                this.timeout(500);

                ocean.compsub('event 6 and event 7 or event 8', function() {

                    if (numSent == 1) {
                        done();
                    }
                    //done();

                });

                setTimeout(function() {
                    ++numSent;
                    ocean.dispatch('event 8');

                }, 10);

                setTimeout(function() {
                    ++numSent;
                    ocean.dispatch('event 7');

                }, 100);

                setTimeout(function() {
                    ++numSent;
                    ocean.dispatch('event 6');

                }, 200);

            });
        }); //end describe compsub


        describe('compsub with state functions', function() {
            it('should take a state function using $ syntax (pos)', function(done) {
                var isTrue = function() {
                    return true;
                };

                this.timeout(200);

                ocean.compsub(['event 9 and $', isTrue], function() {
                    done();
                });

                setTimeout(function() {
                    ocean.dispatch('event 9');
                }, 10);
            });

            it('should take a state function using $ syntax (neg)', function(done) {
                var isFalse = function() {
                    return false;
                };

                this.timeout(300);


                ocean.compsub(['event 10 and $', isFalse], function() {
                    throw new Error('False state function triggered callback');
                });

                setTimeout(function() {
                    ocean.dispatch('event 10');
                }, 10);

                setTimeout(function(){
                    done();
                },250);
            });
        });



    }); // end ocean: dispatch / subscribe
}); // end Ocean state interface
