#ocean-js

An experimental library (framework?) that intends to be an evented interface to shared state. Most (all?) of these ideas have been stolen from the smart people that work on following (and from the people that they have stolen from etc.) [reframe](https://github.com/Day8/re-frame), [reagent](https://github.com/reagent-project/reagent), [clojure atoms](http://clojure.org/atoms), [RxJs](https://github.com/Reactive-Extensions/RxJS), [React](https://github.com/facebook/react). 


* [Example Usage](#1) 
    * [Basic](#1)
    * [Compound Subscriptions](#2)
    * [State Functions](#3)
* [API Documentation](#5)
    * [changed](#6)
    * [compsub](#7)
    * [dispatch](#8)
    * [getItem](#9)
    * [subscribe](#10)
    * [update](#11)
* [Reasoning](#4)
    
---

####Try it out
````html
<script src="http://datamadic.github.io/ocean-js/out/ocean.js"></script>
````

---

## <a name="1"></a> Basic Usage ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var label = document.getElementById('label'),
    btn1 = document.getElementById('btn1');

/* create an ocean */
var ocn = ocean();

/* Set up your shared state. */
var counter = ocn.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocn.dispatch('btn1_clicked');
});

/* React to events */
ocn.subscribe('btn1_clicked', () => {
    ocn.update(counter, (crt) => {
        return ++crt;
    });
});

ocn.changed(counter, () => {
    label.innerHTML = ocn.getItem(counter);
});

````

## <a name="2"></a> Compound Subscriptions ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var btn1 = document.getElementById('btn1'),
	btn2 = document.getElementById('btn2');

/* create an ocean */
var ocn = ocean();

/* Set up your shared state. */
var counter = ocn.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocn.dispatch('btn1_clicked');
});

btn2.addEventListener('click', () => {
    ocn.dispatch('btn2_clicked');
});

/* react only when the conditions you care about are met */
ocn.compsub('btn1_clicked and btn2_clicked', () => {
    console.log('holy shit');
});
	
````

## <a name="3"></a> Compound Subscriptions With State Functions ([from example](http://datamadic.github.io/ocean-js/examples/))
````js
var btn1 = document.getElementById('btn1');

/* create an ocean */
var ocn = ocean();

/* Set up your shared state. */
var counter = ocn.update(() => { return 0; });

/* Wire up events */
btn1.addEventListener('click', function() {
    ocn.dispatch('btn1_clicked');
});

btn2.addEventListener('click', () => {
    ocn.dispatch('btn2_clicked');
});

/* bool state function */
var coutnerGt5 = ()=>{
    return ocn.getItem(counter) > 5;;
} 

/* react only button 1 is clicked and the counter is > 5 */
ocn.compsub(['btn1_clicked and $', coutnerGt5],()=>{
    console.log('woooooow');
});
	
````

---



## <a name="5"></a>API
To create an ocean

````js
var myOcean = ocean();
````

#### <a name="6"></a>changed
`changed(id, callback)` (string, function) -> function()

Callback called when the the value of the data represented by the `id` 
changes. Returns a function that will unsubscribe your callback on that id 
when called. 

#### <a name="7"></a>compsub
#### <a name="8"></a>dispatch
#### <a name="9"></a>getItem
#### <a name="10"></a>subscribe
#### <a name="11"></a>update


---

## <a name="4"></a>Why don't you just tell me which movie you want to see?

We've all seen code like this:
````js
emitter.on('the-event-i-care-about', function(res){
    if(some_state) {
        // do whatever... 
    }
});
````

The thought is this: if you have a conditional acting as the gatekeeper inside of an asynchronous event, the conditional does not belong to you, it should be part of the subscription itself. Say, for example, you want to react to a button click only if the user is logged in. The user being logged in is part of the state that your component (and most likely others) care about. You care so much that if the user is not logged in, you are not going to take your action, so why even fire the callback?





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




    

