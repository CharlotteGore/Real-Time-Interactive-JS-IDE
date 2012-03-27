/*
 * Panda.js 0.2
 */




// we create a function that sets some properties
var Panda = function(){

    this.bambooLevel = 0;
    this.isAsleep = false;
    return this;

};

// then we extend the prototype with methods
Panda.prototype.eatBamboo = function(){

    // increment an instance property..
    this.bambooLevel++;
    
    // and by returning 'this' we can chain the method calls..
    return this;

};

Panda.prototype.goToSleep = function(){

    // set a property...
    this.isAsleep = true;
    
    
    // then execute this.wakeUp in 500 miliseconds...
    setTimeout(this.wakeUp, 500);
    
    // and let us chain from this..
    return this;

};

Panda.prototype.wakeUp = function(){

    // set a property... 
    this.isAsleep = false;
    
    // but we buggered up. 
    assert("We've actually set window.isAsleep", window.isAsleep, false);

    

};

// then we create a new instances of Panda using
// the new keyword
var po = new Panda();

// then we can call our instance methods..
po
    .eatBamboo()
	.eatBamboo()
	.goToSleep();
    
    
    

