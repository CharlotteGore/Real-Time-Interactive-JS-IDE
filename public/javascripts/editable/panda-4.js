/*
 * Panda.js 0.3
 */

(function(){
    
    // now we're using the in-house base framework to 
    // create our object. It makes things a little more
    // comprehensible for the unwary.
    var panda = base.createChild();
    
    

    // pandas cannot be woken up by outside forces.
    // This isn't a private method, but it's only 
    // visible to instances of panda so it's pretty 
    // close. 
    var wakeUp = function(a, b, c){

        this.isAsleep = false;
        
        log('this has run');
        
        assert("I've set window.isAsleep again!", typeof window.isAsleep, "boolean");
        
        log(b);

        
    
        return this;

    };
    
    // instead of manipulating panda.prototype we
    // use the base 'addInstanceMethods'. 
    panda.addInstanceMethods({

        // init is our constructor, it always runs when an
        // instance is created
        "init" : function(){

            this.bambooLevel = 0;
			this.isAsleep = false;

			return this;

		},

        // another method
		"eatBamboo" : function(){

			this.bambooLevel++;
            
            // by returning itself in methods,
            // methods can be chained.
			return this;

		},
        // and another
		"goToSleep" : function(){

			var self = this;

			this.isAsleep = true;

			setTimeout(function(){

				wakeUp.apply(self,[0,1,0]);
                
                //wakeUp();

			}, 1000);

			return this;

		}

	});

	window.panda = panda;

}());

// create an instance of panda. No 'new' keyword required.
var po = panda();

// neato chained methods
po
	.eatBamboo()
	.eatBamboo()
	.goToSleep();


assert('po should be asleep!!', po.isAsleep, true);

assert('po cannot be woken up by us', typeof po.wakeUp, "undefined");




// end