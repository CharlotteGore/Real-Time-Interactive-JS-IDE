/// <reference path="./app.js" />
/// <reference path="./broker.js" />
(function(NICE){
	
	NICE.app.addStaticProperties({
		
		feature : base.createChild()

	});

	NICE.app.feature

		.addStaticMethods({
		
			addFeatureStates : NICE.app.feature.addInstanceMethods,
			addFeatureId : NICE.app.feature.addInstanceProperties,
			addDelegates : function(o){
			
				this.addInstanceProperties({
					
					delegates : o

				});

				return this;

			},
			addSignalHandlers : function(o){
				
				this.addInstanceProperties({
					
					signalHandlers : o

				});

			}

		})
		.addFeatureId({
			
			id : "null"

		})

		.addInstanceMethods({

			init : function(){
			
				var self = this;
				
				self.container = $('<div></div>');
				self.container
						.addClass('nice-ui feature');

				return this;

			},

			_postInit : function(){
				
				var self = this;

				self.status = "new";

				if(this.delegates){
					
					this.registerDelegates();

				}

				if(this.signalHandlers){
					
					this.subscribeSignalHandlers();

				}

				NICE.broker.subscribe("force reload all", self, "forceReload");

			},

			listenForSignals : function(){
			
				var self = this;

				NICE.broker.subscribe("feature action", self, "handleAction");
				return this;		

			},

			attachToView : function( niceUiView ){
			
				var self = this;

				niceUiView.append(self.container);
				
				return this;	

			},
			registerDelegates : function(){
				
				var self = this;

				_.each(self.delegates, function(o, id){
					// here we use a closure to bind the callback
					// to the feature instances' scope.
					var func = (function(callback){
						
						return function(){

							callback.apply(self, arguments);	

						};

					}(o.callback));

					// having created a callback function, we 
					// add it to the aggregator..

					NICE.stateAggregator.addCallbackToDelegate({
						selector : o.selector,
						event: o.event,
						callback : func,
						id : self.id
					});
				}); 

			},

			subscribeSignalHandlers : function(){
				
				var self = this;

				_.each(self.signalHandlers, function( callback, signal){
					
					if(!self[signal]){
						
						self[signal] = (function(callback){
						
							return function(){

								callback.apply(self, arguments);	

							};

						}(callback));

					}
					
					NICE.broker.subscribe(signal, self, signal);

				});

			},

			handleAction : function( o ){
				
				var self = this, currentState = self.state(), newState;

				// does this request contain an instruction for this feature?
				if(o[self.id]){
					
					// is it invoking a method we actually have?
					if(self[ o[self.id].command ]){

						newState = {
							command : o[self.id].command,
							arg : o[self.id].arg
						}

						// we only execute a state change if the state has actually
						// changed. Sometimes, when some other feature changes state
						// all the handlers will fire, which we wish to avoid.

						if(!_.isEqual(currentState, newState)){
							self.state( newState );
							self[ o[self.id].command ](o[self.id].arg);

						}

					}

				}

				return this;

			},

			resizeOn : function( signal ){
				
				var self = this;

				if(!NICE.broker){
					
					throw("NICE.broker not found");

				}else{
					
					NICE.broker.subscribe(signal, self, "handleResizeSignal" );

				}

				return self;

			},

			handleResizeSignal : function( o ){
				
				var self = this;

				self.container.css({
					
					width : o.x,
					height: o.y

				});

				return self;

			},

			state : function( o ){
				
				var self = this;

				if( o ){
					
					self._state = o;
					return self;

				}else{
					
					return self._state;

				}

			},

			onReady : function( signal ){
			
				var self = this;
				
				self.readySignal = signal;

				return self;

			},

			onBusy : function( signal ){
			
				var self = this;
				
				self.busySignal = signal;

				return self;

			},

			ready : function(){
			
				var self = this;

				self.status="ready";

				if(self.readySignal){
					
					NICE.broker.publish(self.readySignal);

				}	

				return self;

			},

			busy : function(){

				var self = this;

				self.status ="busy";

				if(self.readySignal){
					
					NICE.broker.publish(self.busySignal);

				}	

				return self;

			},

			forceStateChange : function( state ){

				var self = this,
					request = {};

				request[self.id] = state;
				
				NICE.broker.publish('feature request', request);

			},

			changeState : function( state ){
			
				var self = this;
				
				self[ state.command ]( state.arg );

				return self;

			},

			changeStateAndHistory : function( state ){
			
				var self = this,
					request = {};

				request[self.id] = state;
				
				NICE.broker.publish('feature request', request);

			},

			forceReload : function(){
				
				var self = this, currentState = self.state();

				// fire the handler.
				self[currentState.command].call(self, currentState.arg);

			}

		});


}(NICE));