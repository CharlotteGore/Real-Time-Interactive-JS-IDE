/// <reference path="./app.js" />
/// <reference path="./broker.js" />
/// <reference path="./hash.js" />

(function(NICE){

	NICE.app.addStaticProperties({
		
		stateAggregator : base.createChild()

	});

	NICE.app.stateAggregator
		.addInstanceProperties({
			
			callbacks : {}


		})
		.addInstanceMethods({
			
			addCallbackToDelegate : function(o){
			
				var self = this;

				if(!self.callbacks[o.event]){
					
					self.callbacks[o.event] = {};

				}

				if(!self.callbacks[o.event][o.selector]){
					
					self.callbacks[o.event][o.selector] = [];

					// this callback binds to the actual event 
					// delegate. One callback per selector/event.

					// delegateHandler gets a reference to the relevant callbacks.
					$(window.document).delegate(
						o.selector, 
						o.event,
						(function(callbacks){
							return function(event){
								self.delegateHandler(event, callbacks, this);
							};
						}(self.callbacks[o.event][o.selector]))
					);

				}

				// now we push the callback into the array that holds
				// this callback for 
				self.callbacks[o.event][o.selector].push({
													id : o.id,
													callback: o.callback});

				return this;

			},

			delegateHandler : function( event, callbacks, element ){
				
				event.preventDefault();

				var self = this;
				var requests = {};


				_.each(callbacks, function(o, index){

					var id = o.id;
					var state = {
						
						request : function( data ){
							
							requests[id] = {};
							$.extend(requests[id], data);

							return true;

						}

					}

					o.callback(event, state, element);

				});

				NICE.broker.publish('feature request', requests);

				return this;

			}

		});

	NICE.addStaticProperties({
		
		stateAggregator : NICE.app.stateAggregator()

	});

}(NICE));