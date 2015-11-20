/*
	A few ideas:
		All global state MUST BE serializible!!! !!! !!! 		
		Any shared state is hashed global
		Events first class, all listenable from everywhere
		You load a base state into the app
		What this reall is is an interface to state itself... 
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
		return JSON.parse(JSON.stringify(world[uuid]));
	}

	function update(...args){
		var uuid, swap;

		if (args.length > 1) {
			uuid = args[0];
			swap = args[1];
		}
		else {
			uuid = '_' + Math.random();
			swap = args[0];
		}

		world[uuid] = swap(world[uuid]);
		dispatch(uuid+'changed', world[uuid]);

		return uuid;
	}

	function dispatch (evnt, ...args) {
		if(events[evnt])
			events[evnt].forEach(action=>{
				action.apply(null, args);
			})
	}

	function subscribe (statement) {

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
		update: update
	};

}());


