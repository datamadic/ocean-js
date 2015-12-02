var label = document.getElementById('label'),
    btn1 = document.getElementById('btn1'),
    btn2 = document.getElementById('btn2'),
    btn3 = document.getElementById('btn3'),
    ulist = document.getElementById('ulist');

/*
    create an ocean
 */
var ocn = ocean();

/*
    Set up your shared state.
*/
var counter = ocn.update(() => {
    return 0;
});

var users = ocn.update(() => {
    return [{
        name: 'bob',
        occupation: 'builder'
    }, {
        name: 'tina',
        occupation: 'teacher'
    }];
});

// see ma, only strings!
console.log('coutner: "%s" users: "%s" ', counter, users);

//first pass paint 
paintUsers(ocn.getItem(users));


/*
    Wire up events
*/
btn1.addEventListener('click', function() {
    ocn.dispatch('btn1_clicked');
});

btn2.addEventListener('click', () => {
    ocn.dispatch('btn2_clicked');
});

btn3.addEventListener('click', () => {
    ocn.dispatch('btn3 clicked');
});


/* bool state functions... */
var coutnerGt5 = () => {
    return ocn.getItem(counter) > 5;
}

var coutnerLt5 = () => {
    return ocn.getItem(counter) < 5;
}


/*
    React to events
*/
var unsub1 = ocn.subscribe('btn1_clicked', () => {
    //increment counter 
    ocn.update(counter, (crt) => {
        return ++crt;
    });
});

ocn.changed(counter, () => {
    label.innerHTML = ocn.getItem(counter);
});

ocn.subscribe('btn2_clicked', () => {
    // add users to a list
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

ocn.compsub('btn1_clicked and btn2_clicked', () => {
    console.log('holy shit');
});

ocn.compsub('btn1_clicked and btn2_clicked or btn3 clicked', () => {
    console.log('holy shit, a 3ed case');
})

ocn.compsub(['btn1_clicked and $', coutnerGt5], () => {
    console.log('woooooow');
});

ocn.compsub(['btn1_clicked and $ or btn2_clicked and $', coutnerGt5, coutnerLt5], () => {
    console.log('tricky tricky...');
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
