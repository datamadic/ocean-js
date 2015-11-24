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
}
else {
	exportObj = window;
}

exportObj.ocn = (function() {
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
    function update(...args) {
        var uuid, swap,
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
            shouldFire, tmparr;



        taps.push((evnt) => {

            //prev[0] is the running list, prev [1] will be set as combo
            var procList = combo.reduce((prev, curr, idx, lst)=>{
                var idxCombo, idxFiltered;

                idxCombo = prev[0].push(curr.filter((condition)=>{
                    return condition !== evnt; 
                })) - 1;

                idxFiltered = prev[1].push(prev[0][idxCombo].filter(cond=>{
                    return typeof cond === 'function' ? !cond() : true;
                })) -1;

                prev[2].push(prev[1][idxFiltered].length);

                return prev;
            },[[], [], []]);

            combo = procList[0];
           	
            // if there are any 0 length cond sets then a cond has been met
            shouldFire = procList[2].filter(numEvents => {
                    return numEvents === 0;
                }).length;

            if (shouldFire) {
                action();
                combo = eventSet.slice();
            }

        });

        // todo: return _remove(taps, THE LISTENER)

    }

    function _composeEvents(stmt) {
        var strPassed = typeof stmt === 'string',
            evntCombo = strPassed? stmt : stmt[0], 
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
            return _mapmap(initProc, (evnt)=>{
            	var replace = evnt === '$';

            	return replace? fnList.shift() : evnt
            });
        }
    } // end _comp...


    function _forforEach(ctx, action) {
        ctx.forEach((inner) => {
            inner.forEach(action);
        });
    }


    function _mapmap(arr, action) {
    	return arr.map((inner)=>{
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

}());