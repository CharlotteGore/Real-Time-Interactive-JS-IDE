/*
 * Panda.js 0.3
 */

var Panda = function(){

    this.bambooLevel = 0;
    this.isAsleep = false;
    return this;

};

Panda.prototype.eatBamboo = function(){

    this.bambooLevel++;
    return this;

};

Panda.prototype.goToSleep = function(){

    var self = this;

    this.isAsleep = true;
    
    // this time instead of passing setTimeout a reference
    // to our method, we pass it an anonymous function
    // which calls the method using the 'self' variable
    // that still points to our instance's scope.
    setTimeout(
    function(){

        self.wakeUp();
        assert('this.wakeup doesn\'t exist', typeof this.wakeUp, "undefined");


    }, 500);

};

Panda.prototype.wakeUp = function(){

    // which means when this runs, we're actually setting

    this.isAsleep = false;

    assert('bamboo is 2', this.bambooLevel, 2);

	assert("We can see our bamboo level", typeof this.bambooLevel, "number");
    

};

var po = new Panda();

po
	.eatBamboo()
	.eatBamboo()
	.goToSleep();




// end