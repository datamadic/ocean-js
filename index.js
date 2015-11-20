var label = document.getElementById('label'),
		btn1 = document.getElementById('btn1'),
		btn2 = document.getElementById('btn2'),
		ulist = document.getElementById('ulist');

/*
	Set up your shared state
*/
var counter = ocn.update(()=>{return 0;});
var users = ocn.update(()=>{
	return[{
		name: 'bob',
		occupation: 'builder'
	},{
		name: 'tina',
		occupation: 'teacher' 
	}];
});

console.log('coutner: "%s" users: "%s" ', counter, users);


/*
	Wire up events
*/
btn1.addEventListener('click', function(){
	ocn.dispatch('btn1 clicked');
});

btn2.addEventListener('click', ()=>{
	ocn.dispatch('btn2 clicked');
});


/*
	React to events
*/
ocn.subscribe('btn1 clicked', ()=>{
	ocn.update(counter, (crt)=>{
		return ++crt;
	});
});

ocn.subscribe('btn2 clicked', ()=>{
	ocn.update(users, (usrs)=>{
		usrs.push({
			name: 'robby',
			occupation: 'robber'
		});

		return usrs;
	});
});

ocn.subscribe(counter+'changed', ()=>{
	label.innerHTML = ocn.getItem(counter);
});

ocn.subscribe(users+'changed', (usrs)=>{
	paintUsers(usrs);
});


function paintUsers(usrs) {
	var docfrag = document.createDocumentFragment();

	ulist.innerHTML = '';

	usrs.forEach(user=>{
		var li = document.createElement('li');

		li.innerHTML = user.name;
		docfrag.appendChild(li);
	});
	
	ulist.appendChild(docfrag);
}

paintUsers(ocn.getItem(users));




ocn.compsub('btn1 clicked and btn2 clicked', ()=>{
	console.log('holy shit');
})
