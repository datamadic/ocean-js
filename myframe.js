/*
	A few ideas:
		All global state MUST BE serializible		
		Any shared state is hashed global
		Events first class, all listenable from everywhere
		You load a base state into the app
		What this really is is an interface to state itself...
		You should know all your shared state from the start
		Cant remove shared state, a null value carries meaning
		You only put things in the shared state that you mean to observe 
*/

window.ocn = (function(){
	var world = {},
			events = {};

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
		if(events[evnt])
			events[evnt].forEach(action=>{
				action.apply(null, args);
			})
	}


	function subscribe(stmt, action){
		(events[stmt] || (events[stmt] = [], events[stmt])).push(action);
	};


	function compsub(stmt, action){
		var combo = stmt.split(' or ').map(act=>{return act.split(' and ')});
		//console.log(combo);
	}


	function loadComponenet (node) {
		function subscribe(stmt, action){
			(events[stmt] || (events[stmt] = [], events[stmt])).push(action);
		};

		function compsub(stmt, action){
			var combo = stmt.split(' or ').map(act=>{return act.split(' and ')});
			console.log(combo);
		}
		
		return {
			subscribe: subscribe,
			compsub: compsub
		};
	}
	
	return {
		dispatch: dispatch,
		subscribe: subscribe,
		loadComponenet: loadComponenet,
		stateAdd: stateAdd,
		getItem: getItem,
		update: update,
		compsub: compsub
	};

}());


