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

window.ocn = (function(){
	var world = {},
			events = {},
			taps = [];

	function stateAdd (state){
		var uuid = '_' + Math.random();

		world[uuid] = state;

		return uuid;
	}


	function getItem (uuid) {
		
		// you get a copy and you'll like it 
		return JSON.parse(JSON.stringify(world[uuid]));
	}


	/*
		swap function must have a return value
	 */
	function update(...args){
		var uuid, swap,
			existedAlready = args.length > 1 ;

		if (existedAlready) {
			uuid = args[0];
			swap = args[1];
		}
		else {
			uuid = '_' + Math.random();
			swap = args[0];
		}

		world[uuid] = swap(world[uuid]);

		// todo: should this be in a timeout 0?
		dispatch(uuid+'changed', world[uuid]);

		return existedAlready? getItem(uuid) : uuid;
	}


	function dispatch (evnt, ...args) {
		taps.forEach(tap => {tap(evnt, args)});
		
		if(events[evnt])
			events[evnt].forEach(action=>{
				action.apply(null, args);
			})
	}


	function subscribe(stmt, action){
		(events[stmt] || (events[stmt] = [], events[stmt])).push(action);
	}


	function changed(ref, action){
		var stmt = ref + 'changed';

		(events[stmt] || (events[stmt] = [], events[stmt])).push(action);
	}


	// holding on the event args, should I implement that??
  // it would be easy...  
	function compsub(stmt, action){
				var eventSet = stmt.split(' or ')
						.map(act=>{
							return act.split(' and ');
						}),
						combo = eventSet.slice(),
						shouldFire;

		taps.push((evnt)=>{

			// remove the fired event from the proper cond set(s)
			combo = combo.map(cond => {
				return cond.filter(evntStr => {
					return evntStr !== evnt;
				});
			});

			// if there are any 0 length cond sets then a cond has been met
			shouldFire = combo.map(condSet=>{
				return condSet.length;
			})
			.filter(numEvents => {
				return numEvents === 0;
			}).length;
			
			if (shouldFire) {
				action();
				combo = eventSet.slice();
			}

		});

		console.log('the combo',combo);
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


