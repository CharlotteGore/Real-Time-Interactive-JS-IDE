/// <reference path="./ui.js" />
(function(NICE, window){
	
	NICE.ui.addStaticProperties({
		
		windowMonitor : base.createChild()

	});

	NICE.ui.windowMonitor.addInstanceMethods({

		data : {
			
			size : {
				x : 0,
				y : 0

			}

		},

		window : $(window),
		
		init : function( callback ){
			
			var self = this;

			if(typeof callback === 'function'){
				
				self.callback = callback;
			
			}else{
			
				self.callback = function(){};	

			}

			self.window.resize(function(){
				
				self.data.size = {
					
					x : self.window.width(),
					y : self.window.height()

				};

				self.callback(self.data.size);

			});

			self.window.resize();

			return this;

		},

		changeCallback : function(callback){
			
			var self = this;

			if(typeof callback === 'function'){
				
				self.callback = callback;

			}

			return self;

		},

		size : function(){
			
			var self = this;

			return self.data.size;

		}

	});

}(NICE, window));