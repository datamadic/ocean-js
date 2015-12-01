/*
    A few ideas:
        All global state MUST BE serializible       
        Any shared state is hashed global
        Events first class, all listenable from everywhere
        What this really is is an interface to state itself...
        You should know all your shared state from the start
        Cant remove shared state, a null value carries meaning
        You only put things in the shared state that you mean to observe 
*/

var exportObj;

if (typeof window === 'undefined') {
    exportObj = module.exports;
} else {
    exportObj = window;
}

exportObj.ocean = () => {
    var world = {},
        events = {},
        taps = [];


    function getItem(uuid) {
        var val = world[uuid];
        // you get a copy and you'll like it 
        return val? JSON.parse(val) : undefined;
    }


    /*
        swap function must have a return value
     */
    function update(...args) {
        var uuid, swap,
            existedAlready = args.length > 1;

        if (existedAlready) {
            uuid = args[0];
            swap = args[1];
        } else {

            // this most likely needs to be stronger 
            uuid = '_' + Math.random();
            swap = args[0];
        }

        world[uuid] = JSON.stringify(swap( getItem(uuid)));

        // todo: should this be in a timeout 0?
        dispatch(uuid + 'changed', getItem(uuid));

        return existedAlready ? getItem(uuid) : uuid;
    }


    function dispatch(evnt, ...args) {
        taps.forEach(tap => {
            tap(evnt, args)
        });

        if (events[evnt])
            events[evnt].forEach(action => {
                action.apply(null, args);
            })
    }


    function subscribe(stmt, action) {
        (events[stmt] || (events[stmt] = [], events[stmt])).push(action);

        return () => {
            _remove(events[stmt], action)
        };
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
            shouldFire, tapFn;

        tapFn = function(evnt) {
            //prev[0] is the running list, prev [1] will be set as combo
            var procList = combo.reduce((prev, curr, idx, lst) => {
                var idxCombo, idxFiltered;

                idxCombo = prev[0].push(curr.filter((condition) => {
                    return condition !== evnt;
                })) - 1;

                idxFiltered = prev[1].push(prev[0][idxCombo].filter(cond => {
                    return typeof cond === 'function' ? !cond() : true;
                })) - 1;

                prev[2].push(prev[1][idxFiltered].length);

                return prev;
            }, [[],[],[]]);

            combo = procList[0];

            // if there are any 0 length cond sets then a cond has been met
            shouldFire = procList[2].filter(numEvents => {
                return numEvents === 0;
            }).length;

            if (shouldFire) {
                action();
                combo = eventSet.slice();
            }
        };

        taps.push(tapFn);

        // todo: fix unsubscribe (is it a broken test?)
        //_remove(taps, tapFn);

    }


    function _remove(arr, item) {
        var idx = arr.indexOf(item),
            exists = idx !== -1;

        if (exists) {
            arr.splice(idx, 1);
        }

    }


    function _composeEvents(stmt) {
        var strPassed = typeof stmt === 'string',
            evntCombo = strPassed ? stmt : stmt[0],
            initProc, fnList;

        initProc = evntCombo.split(' or ')
            .map(act => {
                return act.split(' and ');
            });

        if (strPassed) {
            return initProc

        } else {
            fnList = stmt.slice(1);

            // return an array of arrays where the $ have been replaced in 
            // order with the functions passed in as state functions 
            return _mapmap(initProc, (evnt) => {
                var replace = evnt === '$';

                return replace ? fnList.shift() : evnt
            });
        }
    } // end _comp...


    function _mapmap(arr, action) {
        return arr.map((inner) => {
            return inner.map(action);
        });
    }


    return {
        dispatch: dispatch,
        subscribe: subscribe,
        changed: changed,
        getItem: getItem,
        update: update,
        compsub: compsub
    };

};
