var label = document.getElementById('label'),
    btn1 = document.getElementById('btn1'),
    btn2 = document.getElementById('btn2'),
		btn3 = document.getElementById('btn3'),
    ulist = document.getElementById('ulist');

/*
	Set up your shared state.
*/
var counter = ocn.update(() => { return 0; });

var users = ocn.update(() => {
    return [{
        name: 'bob',
        occupation: 'builder'
    }, {
        name: 'tina',
        occupation: 'teacher'
    }];
});

console.log('coutner: "%s" users: "%s" ', counter, users);

paintUsers(ocn.getItem(users));


/*
	Wire up events
*/
btn1.addEventListener('click', function() {
    ocn.dispatch('btn1 clicked');
});

btn2.addEventListener('click', () => {
    ocn.dispatch('btn2 clicked');
});

btn3.addEventListener('click', () => {
    ocn.dispatch('btn3 clicked');
});


/*
	React to events
*/

// inc counter 
var unsub1 = ocn.subscribe('btn1 clicked', () => {
    ocn.update(counter, (crt) => {
        return ++crt;
    });
});


ocn.changed(counter, () => {
    label.innerHTML = ocn.getItem(counter);
});



// add users to a list
ocn.subscribe('btn2 clicked', () => {
    ocn.update(users, (usrs) => {
        usrs.push({
            name: 'robby',
            occupation: 'robber'
        });

        return usrs;
    });
});


ocn.changed(users, (usrs) => {
    paintUsers(usrs);
});




function paintUsers(usrs) {
    var docfrag = document.createDocumentFragment();

    ulist.innerHTML = '';

    usrs.forEach(user => {
        var li = document.createElement('li');

        li.innerHTML = user.name;
        docfrag.appendChild(li);
    });

    ulist.appendChild(docfrag);
}



ocn.compsub('btn1 clicked and btn2 clicked or btn3 clicked', () => {
    console.log('holy shit');
})

ocn.compsub('btn1 clicked and btn2 clicked or btn3 clicked and btn1 clicked', () => {
    console.log('holy shit again');
})

