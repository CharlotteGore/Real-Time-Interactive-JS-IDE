/// <reference path="./ui.js" />

(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		shinyTypeAhead : base.createChild()

	});

	NICE.ui.shinyTypeAhead
		.addInstanceMethods({
			
			init : function( config ){
				
				var self = this;

				// measure the input element...

				//console.log(config);

				_.extend( self, {
					
					datauri : config.datauri,
					onResult : config.onResult,
					onCancel : config.onCancel,
					element : config.element,
					results : [],
					status : "clean"

				});

				self.element
					.css({
						
						position: 'relative'

					})
					.bind('keydown', function( event ){
						
						self.status = "unclean";

						var key = event.key || event.which

					})
					.bind('blur', function( event ){
						setTimeout(function(){
							
							self.onCancel()

						},200);
					})
					.bind('focus', function( event ){
						self.status = "unclean";

					})


			    self.checkStatus();

			    return self;


			},

			checkStatus : function(){

				var self = this;

		        if (self.status === "clean") {

		            setTimeout(function () {

		                self.checkStatus();

		            }, 50);

		        } else {

		        	var val = self.element.val().replace(/\s/g, '%20'),
		        		nospaces = self.element.val().replace(/\s/g, '');

		            self.status = "clean";

		            if(nospaces !== ''){

			            $.ajax({ url: self.datauri.replace(/{(term)}/, val), crossDomain: false, dataType: "json",
			            	error : function(){
			            		self.onResult({});
			            		self.checkStatus();

			            	},
			                success: function (data, status, res) {

			                	self.onResult( data );
			                	self.checkStatus();
			                }

			            });

					}else{
						
						self.onResult({});
						self.checkStatus();

					}

		        }

			}

		});


}(NICE));


(function($){
	
	$.fn.shinyTypeAhead = function( config ){

		config.element = this;

		return NICE.ui.shinyTypeAhead(config);
		
	}

}( jQuery ) );

/*

/// <reference path="./ui.js" />

(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		shinyTypeAhead : base.createChild()

	});

	NICE.ui.shinyTypeAhead
		.addInstanceMethods({
			
			init : function( config ){
				
				var self = this;

				// measure the input element...

				//console.log(config);

				_.extend( self, {
					
					datauri : config.datauri,
					onResult : config.onResult,
					onCancel : config.onCancel,
					element : config.element,
					results : [],
					status : "clean"

				});

								//console.log([self, self.datauri.replace(/{(term)}/, 'abc')]);

				self.element
					.css({
						
						position: 'relative'

					})
					.bind('keydown', function( event ){
						
						self.status = "unclean";

						var key = event.key || event.which

					})
					.bind('blur', function( event ){
						setTimeout(function(){
							
							self.onCancel()

						},200);
					})
					.bind('focus', function( event ){
						self.status = "unclean";

					})


			    self.checkStatus();

			    return self;


			},

			checkStatus : function(){

				var self = this;

		        if (self.status === "clean") {

		            setTimeout(function () {

		                self.checkStatus();

		            }, 50);

		        } else {

		        	var val = self.element.val().replace(/\s/g, '%20'),
		        		nospaces = self.element.val().replace(/\s/g, '');


		            self.status = "clean";

		           // if(nospaces !== ''){

			            $.ajax({ url: self.datauri.replace(/{(term)}/, val), crossDomain: false, dataType: "json",
			            	error : function(){
			            		self.onResult({});
			            		self.checkStatus();

			            	},
			                success: function (data, status, res) {

			                	self.onResult( data );
			                	self.checkStatus();
			                }

			            });

					//}else{
						
					//	self.onResult({});
					//	self.checkStatus();

					//}

		        }

			}

		});


}(NICE));


(function($){
	
	$.fn.shinyTypeAhead = function( config ){

		config.element = this;

		return NICE.ui.shinyTypeAhead(config);
		
	}

}( jQuery ) );

*/