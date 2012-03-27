/*
 * Panda.js 0.3
 */

(function(){

    var panda = base.createChild();

    // pandas cannot be woken up by outside forces.
    // This isn't a private method, but it's only 
    // visible to instances of panda so it's pretty 
    // close. 
    var wakeUp = function( callback ){

        this.isAsleep = false;
        
        callback();

        return this;

    };

	panda.addInstanceMethods({

		"init" : function(){

			this.bambooLevel = 0;
			this.isAsleep = false;

			return this;

		},

		"eatBamboo" : function(){

			this.bambooLevel++;

			return this;

		},

		"goToSleep" : function( callback ){

			var self = this;

			this.isAsleep = true;

			setTimeout(function(){

                // when we call the closure function wakeUp, 
                // we want to bind the scope to this instance

				wakeUp.call(self, callback);

			}, 1000);

			return this;

		}

	});

	window.panda = panda;

}());

var po = panda();

po
	.eatBamboo()
	.eatBamboo()
	.goToSleep( function(){
 
        assert('Po is awake!', 1, 1);
        
 
	});


assert('po should be asleep to begin with', po.isAsleep, true);
assert('po cannot be woken up by us', typeof po.wakeUp, "undefined");
assert('wakeUp isnt in the global scope', typeof wakeUp, "undefined");


// end