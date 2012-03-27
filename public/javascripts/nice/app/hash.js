/// <reference path="../../jquery/plugins/jquery-bbq.js" />
/// <reference path="./app.js" />
/// <reference path="./broker.js" />


(function(NICE){ 
	
	NICE.app.addStaticProperties({
		
		hash : base.createChild()

	});

	NICE.app.hash.addInstanceMethods({
		
		init : function(){

			var self = this;

			self.defaultState = {};
			self.callback = function(){};

			if(!$ || !$.bbq){
				
				throw("No jQuery BBQ Plugin.");

			}else{

				$(window).unbind('hashchange');
				$(window).bind('hashchange', function(e){
					
					self.changed(e);

				});

				NICE.broker.subscribe("feature request", self, 'change');

				self.callback = function( data ){
					
					NICE.broker.publish("feature action", data );

				};


				return this;

			}

		},

		formatRequest : function( request ){
			
			var o = {};
			o[request.feature] = {
				command : request.command

			};
			if(request.arg){
				
				o[request.feature].arg = request.arg;

			}

			return o;

		},

		setDefault : function( o ){
			
			this.defaultState = o;

			return this;

		},

		runDefault : function(){
		
			this.change(this.defaultState);	

		},
		change : function( o ){
			
			var state = {}, i;

			for(i in o){
				
				if(o.hasOwnProperty(i)){
					
					if(o[i].command && o[i].arg){
						
						state[i] = o[i].command + ":" + o[i].arg;

					}else if(o[i].command && !o[i].arg){
						
						state[i] = o[i].command;

					}

				}

			}

			$.bbq.pushState(state);
			
			return this;

		},

		changed : (function(){

			var parseHash = function(val){
				
				var bits = val.split(':');
				
				bits[0] ? null : bits[0] = '';
				bits[1] ? null : bits[1] = '';

				return {
					command: bits[0],
					arg: bits[1]
				};		

			};

			var readHash = function(){
				
				var data = $.bbq.getState(), i, result = {};

				for(i in data){
					if(data.hasOwnProperty(i)){
						
						result[i] = parseHash(data[i]);
					}

				}

				return result;

			};

			return function(e){
			
				var i, o = $.extend({}, this.defaultState);
				
				$.extend(o, readHash());

				this.callback(o);

				return true;

			};

		}())

	});

	NICE.addStaticMethods({
		
		hash : NICE.app.hash()

	});

}(NICE));