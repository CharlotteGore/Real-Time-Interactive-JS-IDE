(function(devLed){
	
	var assert = base.createChild();

	assert.addInstanceMethods({

		init : function(description, opA, opB){

			var self = this,
				result;

			try{

				result = (opA === opB);

			}catch(e){

				result = false;

			}

			NICE.broker.publish("new assertion", {

				description : description,
				result : (opA === opB)

			});

			return self;

		}

	});

	window.assert = assert;
	window.log = function( str ){

		$('div.assertions').prepend('<div class="assert true">' + (new Date()).toLocaleTimeString() + ": " + str + '</div>');
	}

}(devLed));