/// <reference path="./ui.js" />
/// <reference path="./view.js" />
(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		twoColumnView : NICE.ui.view.createChild(),
		divider : NICE.ui.view.createChild()

	});

	NICE.ui.twoColumnView.addInstanceMethods({
		
		config : {
			left : 300,				
			right : 'auto',
			divider : 10
		},

		init : function( config ){
			
			var self = this;

			// because we're overriding the normal view.init(), we need to 
			// duplicate the initialisation there...
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

				}())

			};

			self.panels = {
				
				left : NICE.ui.view(),
				right: NICE.ui.view(),
				divider : NICE.ui.divider()

			};

			self.addClass('two-panel-view');

			self.panels.left
						.addClass('left-panel')
						.resizeOn("left panel resized")
						.appendTo( self.data.container );

			self.panels.divider
						.addClass('divider-panel')
						.resizeOn('divider panel resized')
						.appendTo( self.data.container );

			self.panels.right
						.addClass('right-panel')
						.resizeOn("right panel resized")
						.appendTo( self.data.container );

			NICE.broker
				.subscribe("left panel ready", self, "leftPanelReady")
				.subscribe("left panel busy", self, "leftPanelBusy")
				.subscribe("right panel ready", self, "rightPanelReady")
				.subscribe("right panel busy", self, "rightPanelBusy")
				

			$.extend(self.config, config);

			return this;

		},

		left : function(  ){
			
			var self = this;

			return self.panels.left;

		},

		leftPanelBusy : function(){
			
			var self = this; 
			
			self.panels.left.disable();

			return self;

		},

		leftPanelReady : function(){
			
			var self = this; 

			self.panels.left.enable();

			return self;

		},

		rightPanelBusy : function(){
			
			var self = this; 

			self.panels.right.disable();

			return self;

		},

		rightPanelReady : function(){

			var self = this; 

			self.panels.right.enable();

			return self;

		},

		right : function(){
			
			var self = this;

			return self.panels.right;

		},

		// override handleResizeSignal to pass signals down to the 
		// individual panels
		handleResizeSignal : function( o ){
			
			var self = this, 
				left = {
					position: {
						x : 0,
						y : 0

					},
					size : {
						y : o.y
					} 
				}, 
				right = {
					position: {
						y : 0						
					},
					size : {
						y : o.y
					}
				};

			if(self.config.left==='auto' && self.config.right==='auto'){
			
				left.size.x = Math.floor((o.x / 2) - (self.config.divider / 2));

				right.size.x = Math.floor((o.x / 2) - (self.config.divider / 2));

			}else if(self.config.left!=='auto'){
				
				left.size.x = self.config.left;

				right.size.x = (o.x - self.config.left) - self.config.divider;

				//do nothing

			}else if(self.config.right!=='auto'){
				
				left.size.x = (o.x - self.config.right) - self.config.divider;

				right.size.x = self.config.right;

			}

			right.position.x = left.size.x + self.config.divider;

			self.panels.right.position(right.position);
			self.panels.divider.position({ x: left.size.x, y : 0 });

			NICE.broker.publish('left panel resized', left.size);
			NICE.broker.publish('right panel resized', right.size);
			NICE.broker.publish('divider panel resized', { x : self.config.divider, y : o.y });				

			self.size(o);



		}

	});

}(NICE));