'use strict';

/*
	A few ideas:
		All global state MUST BE serializible		
		Any shared state is hashed global
		Events first class, all listenable from everywhere
		--You load a base state into the app
		What this really is is an interface to state itself...
		You should know all your shared state from the start
		Cant remove shared state, a null value carries meaning
		You only put things in the shared state that you mean to observe 
*/
//var brwsr = window !== undefined;
//var exportObj = brwsr ? window : module? module.exports : {};
var exportObj;

if (typeof window === 'undefined') {
    exportObj = module.exports;
} else {
    exportObj = window;
}

exportObj.ocn = (function () {
    var world = {},
        events = {},
        taps = [];

    function stateAdd(state) {
        var uuid = '_' + Math.random();

        world[uuid] = state;

        return uuid;
    }

    function getItem(uuid) {

        // you get a copy and you'll like it
        return JSON.parse(JSON.stringify(world[uuid]));
    }

    /*
    	swap function must have a return value
     */
    function update() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var uuid,
            swap,
            existedAlready = args.length > 1;

        if (existedAlready) {
            uuid = args[0];
            swap = args[1];
        } else {
            uuid = '_' + Math.random();
            swap = args[0];
        }

        world[uuid] = swap(world[uuid]);

        // todo: should this be in a timeout 0?
        dispatch(uuid + 'changed', world[uuid]);

        return existedAlready ? getItem(uuid) : uuid;
    }

    function dispatch(evnt) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        taps.forEach(function (tap) {
            tap(evnt, args);
        });

        if (events[evnt]) events[evnt].forEach(function (action) {
            action.apply(null, args);
        });
    }

    function subscribe(stmt, action) {
        (events[stmt] || (events[stmt] = [], events[stmt])).push(action);

        return function () {
            _remove(events[stmt], action);
        };
    }

    function _remove(arr, item) {
        var idx = arr.indexOf(item),
            exists = idx !== -1;

        if (exists) {
            arr.splice(idx, 1);
        }
    }

    function changed(ref, action) {
        var stmt = ref + 'changed';

        return subscribe(stmt, action);
    }

    // holding on the event args, should I implement that??
    // it would be easy... 
    function compsub(stmt, action) {
        var eventSet = _composeEvents(stmt),
            combo = eventSet.slice(),
            shouldFire,
            tmparr;

        taps.push(function (evnt) {

            // remove the fired event from the proper cond set(s)
            combo = combo.map(function (cond) {
                return cond.filter(function (evntStr) {
                    var isFunction = typeof evntStr === 'function';

                    if (isFunction) {
                        return true;
                    }

                    return evntStr !== evnt;
                });
            });

            // if there are any 0 length cond sets then a cond has been met
            shouldFire = combo.map(function (cond) {
                return cond.filter(function (evntStr) {
                    var isFunction = typeof evntStr === 'function';

                    if (isFunction) {

                        var retval = !evntStr();
                        return retval;
                    }

                    return true;

                    //return evntStr !== evnt;
                });
            });

            shouldFire = shouldFire.map(function (condSet) {
                return condSet.length;
            }).filter(function (numEvents) {
                return numEvents === 0;
            }).length;

            if (shouldFire) {
                action();
                combo = eventSet.slice();
            }
        });
    }

    function _composeEvents(stmt) {
        var strPassed = typeof stmt === 'string',
            initProc,
            fnList;

        if (strPassed) {
            return stmt.split(' or ').map(function (act) {
                return act.split(' and ');
            });
        } else {
            initProc = stmt[0].split(' or ').map(function (act) {
                return act.split(' and ');
            });

            fnList = stmt.slice(1);

            return _mapmap(initProc, function (evnt) {
                var shouldShift = evnt === '$';

                return shouldShift ? fnList.shift() : evnt;
            });
        }
    } // end _comp...

    function _forforEach(ctx, action) {
        ctx.forEach(function (inner) {
            inner.forEach(action);
        });
    }

    function _mapmap(arr, action) {
        return arr.map(function (inner) {
            return inner.map(action);
        });
    }

    return {
        dispatch: dispatch,
        subscribe: subscribe,
        changed: changed,
        stateAdd: stateAdd,
        getItem: getItem,
        update: update,
        compsub: compsub
    };
})();
