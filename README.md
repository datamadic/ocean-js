#ocean-js

An experimental library (framework?) that intends to be an evented interface to shared state. Most (all?) of these ideas have been stolen from the smart people that work on following (and from the people that they have stolen from etc.) [reframe](https://github.com/Day8/re-frame), [reagent](https://github.com/reagent-project/reagent), [clojure atoms](http://clojure.org/atoms), [RxJs](https://github.com/Reactive-Extensions/RxJS), [React](https://github.com/facebook/react). 

#####try it out (wip)
````html
<script src="http://datamadic.github.io/ocean-js/out/ocean.js"></script>
````

##Basic Usage ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var label = document.getElementById('label'),
    btn1 = document.getElementById('btn1');

/* Set up your shared state. */
var counter = ocean.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocean.dispatch('btn1_clicked');
});

/* React to events */
ocean.subscribe('btn1_clicked', () => {
    ocean.update(counter, (crt) => {
        return ++crt;
    });
});

ocean.changed(counter, () => {
    label.innerHTML = ocean.getItem(counter);
});

````

##Compound Subscriptions ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var btn1 = document.getElementById('btn1'),
	btn2 = document.getElementById('btn2');

/* Set up your shared state. */
var counter = ocean.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocean.dispatch('btn1_clicked');
});

btn2.addEventListener('click', () => {
    ocean.dispatch('btn2_clicked');
});

/* react only when the conditions you care about are met */
ocean.compsub('btn1_clicked and btn2_clicked', () => {
    console.log('holy shit');
});
	
````

##Compound Subscriptions With State Functions ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var btn1 = document.getElementById('btn1');

/* Set up your shared state. */
var counter = ocean.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocean.dispatch('btn1_clicked');
});

btn2.addEventListener('click', () => {
    ocean.dispatch('btn2_clicked');
});

/* bool state function */
var coutnerGt5 = ()=>{
    return ocean.getItem(counter) > 5;;
} 

/* react only button 1 is clicked and the counter is > 5 */
ocean.compsub(['btn1_clicked and $', coutnerGt5],()=>{
    console.log('woooooow');
});
	
````

---


####Why don't you just tell me which movie you want to see?

We've all seen code like this:
````js
emitter.on('the-event-i-care-about', function(res){
	if(some_state) {
		// do whatever... 
	}
});
````

The thought is this: if you have a conditional acting as the gatekeeper inside of an asynchronous event, the conditional does not belong to you, it should be part of the subscription itself. Say, for example, you want to react to a button click only if the user is logged in. The user being logged in is part of the state that your component (and most likely others) care about. You care so much that if the user is not logged in, you are not going to take your action, so why even fire the callback?

###API
coming soon to markdown near you!




[//]: # (The basic premise, so far... :) )



[//]: # (* [The shared state is owned by everyone and no one](#1))
[//]: # (* [All shared state MUST be serializable](#2))
[//]: # (* [Events can be defined and dispatched from anywhere](#3))
[//]: # (* [You should know all your shared state from the start](#4))
[//]: # (* [Cant remove shared state (WTF?), an empty value carries meaning](#5))
[//]: # (* [You only put things in the shared state that you mean to observe ](#6))
[//]: # (#### <a name="1"></a> The shared state is owned by everyone and no one)
[//]: # (#### <a name="2"></a> All shared state MUST be serializable)
[//]: # (#### <a name="3"></a> Events can be defined and dispatched from anywhere)
[//]: # (#### <a name="4"></a> You should know all your shared state from the start)
[//]: # (#### <a name="5"></a> Cant remove shared state (WTF?), a null value carries meaning)
[//]: # (#### <a name="6"></a> You only put things in the shared state that you mean to observe)




    

