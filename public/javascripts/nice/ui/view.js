/// <reference path="./ui.js" />
(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		view : base.createChild()

	});

	NICE.ui.view.addInstanceMethods({

		init : function( o ){

			var self = this;

			self.data = {
			
				position : {
					
					x : 0,
					y : 0

				},

				size : {
					
					x : 0,
					y : 0

				},

				container : (function(){
					
					var c = $('<div></div>');
					c
						.addClass('NICE-ui-view view')
						.css({
							position: 'absolute',
							overflow: 'hidden'

						});

					

					return c;

				}()),

				blocker : (function(){
					
					var c = $('<div></div>');
					c
						.addClass('NICE-ui-view blocker')
						.css({
							position: 'absolute',
							top: 0,
							left : 0,
							width : "100%",
							height: "100%",
							background : "#fff",
							opacity : 0.8
						});

					return c;

				}())

			};

			return self;

		},

		enable : function(){
			
			var self = this;

			self.data.blocker.remove();
			return this;

		},

		disable : function(){
			var self = this;

			self.data.container.append(self.data.blocker);

			return this;

		},

		append : function( jq ){
			
			var self = this;

			if( jq ){
				
				self.data.container.append(jq);

			}

			return self;

		},

		appendTo : function( jq ){
			
			var self = this;

			if( jq ){
				
				jq.append(self.data.container);
				//self.data.container.after(self.data.blocker);

			}

			return self;

		},

		detach : function(){
			
			var self = this;

			self.data.container.remove();

			return self;

		},

		addClass : function( classes ){
			
			var self = this;

			self.data.container.addClass( classes );

			return self;

		},

		position : function( o ){
			
			var self = this;

			if( o ){
				
				if( typeof o.x ==='number'){
					
					self.data.position.x = o.x;

					self.data.container.css({
						
						left : o.x

					});

				}

				if( typeof o.y ==='number'){
					
					self.data.position.y = o.y;

					self.data.container.css({
						
						top : o.y

					});

				}

				return self;

			}else{
				
				return self.data.position;

			}

		},

		size : function( o ){

			var self = this;

			if( o ){
				
				if( o && typeof o.x ==='number'){
					
					self.data.size.x = o.x;

					self.data.container.css({
						
						width : o.x

					});

				}

				if( o && typeof o.y ==='number'){
					
					self.data.size.y = o.y;

					self.data.container.css({
						
						height : o.y

					});

				}

				return self;

			}else{
				
				return self.data.size;

			}


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

			self.size( o );

			return self;

		},

		measure : function(){
			
			var self = this,
				//size = self.size(),
				measurements = {};

			//self.data.container.css({
				
			//	width: 'auto',
			//	height: 'auto'

			//});

			measurements = {
				x : self.data.container.outerWidth(true),
				y : self.data.container.outerHeight(true)

			}

			//self.size(size);

			return measurements;

		},

		show : function(){
			
			var self = this;

			self.data.container.show();

			return self;

		},

		hide : function(){
		
			var self = this;
			
			self.data.container.hide();	

			return self;

		},

		addClass : function( classes ){

			var self = this;
			
			self.data.container.addClass( classes );	

			return self;


		},

		removeClass : function( classes ){

			var self = this;
			
			self.data.container.removeClass( classes );	

			return self;

		},

		css : function( o ){
		
			var self = this;
			
			self.data.container.css( o );
			
			return self;	

		},

		empty : function(){

			var self = this;
			
			self.data.container.empty();

			return self;

		},

		html : function( content ){
			
			var self = this;

			self.data.container.html( content );

			return self;

		},

		append : function( jq ){
			
			var self = this;

			self.data.container.append( jq );

			return self;

		},

		prepend : function( jq ){
			
			var self = this;

			self.data.container.prepend( jq );

			return self;

		}


	});

}(NICE));