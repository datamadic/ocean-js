#ocean-js

An experimental library (framework?) that intends to be an evented interface to shared state. Most (all?) of these ideas have been stolen from the smart people that work on following (and from the people that they have stolen from etc.) [reframe](https://github.com/Day8/re-frame), [reagent](https://github.com/reagent-project/reagent), [clojure atoms](http://clojure.org/atoms), [RxJs](https://github.com/Reactive-Extensions/RxJS), [React](https://github.com/facebook/react). 

---

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
btn1.addEventListener('click', () => {
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
btn1.addEventListener('click', () => {
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
btn1.addEventListener('click', () => {
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
A brief overview here...

To create an ocean

````js
var myOcean = ocean();
````

#### <a name="6"></a>changed
`changed(id, callback)` (string, function) -> function()

Callback called when the the value of the data represented by the id 
changes. Returns a function that will unsubscribe your callback on that id 
when called. 

#### <a name="7"></a>compsub
`compsub(events, callback)` (string | array, function) -> function()

Callback called when event conditions are met. Can take a string, or an array 
where the first item is a string and subsequent items are functions. Keywords 
`and` and `or` can be used to describe events. When an array is passed, any `$`
passed in will be replaced by the functions in order. 

With string
````js
myOcean.compsub('btn1_clicked and btn2_clicked', () => {
    console.log('holy shit');
});
````

With array
````js
myOcean.compsub(['btn1_clicked and $', coutnerGt5], () => {
    console.log('woooooow');
});
````

With array and keywords
````js
myOcean.compsub(['btn1_clicked and $ or btn2_clicked and $', coutnerGt5, coutnerLt5], () => {
    console.log('tricky tricky...');
});
````

See [examples](http://datamadic.github.io/ocean-js/examples/)

#### <a name="8"></a>dispatch
`dispatch(event, eventArgs)` (string, any) -> undefined

Dispatch the event into your ocean instance. Spaces in event names are fine,
but event string cannot contain ` and ` or ` or `.


#### <a name="9"></a>getItem
`getItem(id)` (string) -> any

Returns the value represented by the given id.


#### <a name="10"></a>subscribe
`subscribe(event, callback)` (string, function) -> function()

Callback called when event is raised. The callback will take any values passed 
in for the event via the `dispatch` function. 


#### <a name="11"></a>update
`update(id, swapFunction)` ([string,] function) -> any

Calls the swap function on the value represented by id. The swap function must
return a value or the state stored by ocean will be undefined. You get a copy 
of the result of applying the swap function returned to you. When an id is 
omitted, it acts as an initialization function, setting the state and return a
new id.

Initializing a value
````js
var counter = myOcean.update(() => {
    return 0;
});
````

Updating an array where `users` is an id and `usersArr` is the value 
handed to you by ocean that you update
````js
myOcean.update(users, (usersArr) => {
    usersArr.push({
        name: 'robby',
        occupation: 'robber'
    });

    return usersArr;
});
````


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




    

