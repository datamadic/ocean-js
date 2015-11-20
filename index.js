var label  = document.getElementById('label');
var btn1 = document.getElementById('btn1');
var btn2 = document.getElementById('btn2');

btn1.addEventListener('click', function(){
	ocn.dispatch('btn1 clicked');
});

btn2.addEventListener('click', function(){
	ocn.dispatch('btn2 clicked');
});

var counter = ocn.update(()=>{return 0;});

var lComponent = ocn.loadComponenet(btn1);

lComponent.subscribe('btn1 clicked', function(){
	console.log('gotcha', ocn.getItem(counter));
	ocn.update(counter, (crt)=>{
		return ++crt;
	});
	
		console.log('gotcha', ocn.getItem(counter));
});

lComponent.subscribe(counter+'changed', ()=>{
	label.innerHTML = ocn.getItem(counter);
});

lComponent.compsub('btn1 clicked and btn2 clicked', ()=>{
	console.log('holy shit');
})
