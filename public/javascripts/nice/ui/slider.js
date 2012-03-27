/// <reference path="./ui.js" />
/// <reference path="./tween.js" />

/*
	
	Usage: var slider = NICE.ui.slider({
		align : 'vertical' || 'horizontal',
		size : Number,  // the thickness of the scrollbar
		horiontalGutter : Number, // the horizontal margin
		verticalGutter : Number, // the vertical margin
		callback : Function, // whenever the scrollbar is moved, this callback will be called
							 // and passed the current value

	})

*/

(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		slider : base.createChild()

	});

	NICE.ui.slider
		.addInstanceMethods({

			init : function( options ){

				var self = this, 
					DOM, 
					user, 
					slider;

				// We have some useful defaults here...
				// let's mix in the other information.
				self.config = _.extend({		
					size: 10,
					align: 'vertical',
					gutters : {
						horizontal : 8,
						vertical : 25						
					},
					callback : function(){},
					parent : $('body'),
					minimum : 0,
					maximum : 0,
					initial : 0
				}, options );

				self.DOMElements = {
					parent : self.config.parent,
					container : $('<div></div>'),
					handle : $('<div></div>')
				}

				DOM = self.DOMElements;

				DOM.container
					.css({
						'position': 'absolute'
					})
					.addClass('slider-background');

				DOM.handle
					.css({
							position: 'absolute',
							top : 0,
							left : 0
					})
					.addClass('slider-handle');

				// There's values for the external owner. E.g, 0 to -700.

				self.state = {
					
					user : {
						min : self.config.minimum,
						max : self.config.maximum,
						currentValue : self.config.initial
					},

					slider : {
						limits : {
							min : 0,
							max : 0

						},
						currentValue : 0,
						sizes : {
							container : {
								width : 0,
								height : 0

							},
							handle : {
								width : 50,
								height : 50
							},
							parent : {
								width : self.config.parent.outerWidth(),
								height : self.config.parent.outerHeight()
							}

						},
						handle : {
							size : 0							
						},
						container : {
							size : 0							
						},
						parent : {
							size : 0	
						}
					}

				};

				self.configureAlignment();

				// HTML generation for the scroll bar

				DOM.parent.css({ position : 'relative'});

				if(!window.Touch){
					
					self.bindMouseHandlers();

				}
				// append the scroll handle
				DOM.container.append(DOM.handle);

				// append the scrollbar container
				DOM.parent.append(DOM.container);

				// start with the parent size rather than insisting on a resize call.
				self.resize( self.state.slider.sizes.parent );

				return this;

			},

			configureAlignment : function(){

				var self = this, 
					DOM = self.DOMElements,
					slider = self.state.slider, 
					config = self.config;

				if(self.config.align==='horizontal'){

					config.gutter = config.gutters.horizontal;

					//slider.handle.size = function(){ return slider.sizes.handle.width; },
					slider.setHandleSize = function( width ){
						
						slider.sizes.handle.width = width;
						DOM.handle.css({ width : width});

					};
					slider.setHandlePosition = function( position ){
					
						DOM.handle.css({
							left : slider.currentValue							
						})	

					};
					slider.setContainerSize = function( width ){
						
						slider.sizes.container.width = width;
						DOM.container.css({ width : width});

					};
					slider.container.size = function(){ return slider.sizes.parent.width - (config.gutter * 2);},
					slider.parent.size = function(){ return slider.sizes.parent.width; },

					DOM.container.css({

						bottom : config.gutters.vertical,
						left : config.gutters.horizontal,
						'height' : config.size

					});

					DOM.handle.css('height', config.size);

				}else{

					config.gutter = config.gutters.vertical;

					slider.handle.size = function(){ return slider.sizes.handle.height;},
					slider.container.size = function(){ return slider.sizes.parent.height - (config.gutter * 2);},
					slider.parent.size = function(){ return slider.sizes.parent.width;},

					slider.setHandleSize = function( height ){
						
						slider.sizes.handle.height = height;
						DOM.handle.css({ height : height});
						self.updateSliderLimits();

					};
					slider.setHandlePosition = function( position ){
					
						DOM.handle.css({
							top : slider.currentValue					
						})	

					};
					slider.setContainerSize = function( height ){
						
						slider.sizes.container.height = height;
						DOM.container.css({ height : height});

					};
					DOM.container.css({
						top : config.gutters.vertical,
						right : config.gutters.horizontal,
						'width' : config.size
					});

					DOM.handle.css('width', config.size);

				}



				return self;

			},

			limits : function( limits ){


				var self = this, 
					user = self.state.user;

				// Internally the scrollbar works from 0-100%. However it returns a real useful value.
				// Therefore it must know the value for 0% and 100%

				if(limits){

					user.min = limits.minimum || 0;
					user.max = limits.maximum || 0;

					// changing the limits has an effect on the size of the slider handle!
					// yikes!

					self.resize();

					return self;

				}else{

					return {
						minimum : user.min,
						maximum : user.max
					};

				}

			},

			updateSliderLimits : function(){
			
				var self = this,
					slider = self.state.slider;
					
				slider.limits.max = slider.container.size() - slider.handle.size();

				return self;	

			},

			value : function( val ){

				// collapse a LOAD of references
				var self = this, 
					user = self.state.user, 
					slider = self.state.slider, 
					DOM = self.DOMElements,
					config = self.config,
					userPercent,
					sliderPercent,
					valuePercent

				// getter/setter for the slider 'value'. This value represents a value between
				// 0% and 100% of 
				
				if( typeof val === 'number' ){

					// if the user's value is n% between minimum and maximum, so 
					// the slider's value needs to be n% between its minimum and maximum.

					user.currentValue = val;

					slider.currentValue = self.convertUserValueToSliderValue( user.currentValue );

					if(_.isNaN(slider.currentValue)){
						
						slider.currentValue = 0;

					}

					// Now that we have the value, we can move the handle
					slider.setHandlePosition();

					return self;

				}else{

					return user.value;

				}

			},

			position : function( val ){

				// collapse a load of referecnces.. 
				var self = this, 
					user = self.state.user, 
					slider = self.state.slider, 
					config = self.config,
					userPercent,
					sliderPercent;

				// we always get passed a relative value here...
				val = val + slider.currentValue;

				// contrain it based on known limits...
				val = self.constrainValue( val );
				// we convert the slider's internal numbers in the user's numbers,
				// being the same % between the user's min/max.

				config.callback( self.convertSliderValueToUserValue( val ) );

				return self;

			},

			centerOn : function( val ){

				// this is the method called when a user clicks somewhere
				// within the slider container.

				var self = this,
					slider = self.state.slider;

				val = val - Math.floor(slider.handle.size() / 2);
				
				val = self.constrainValue( val );
				// convert self value to owner value. 

				var that = this;

				var tween = NICE.ui.tween({
					start : slider.currentValue || 0,
					end : val,
					duration: 750,
					easing: "decelerate",
					fps : 30,
					callback : function( val ){
							
						self.config.callback( self.convertSliderValueToUserValue( val ) );

					}
				});

				tween.play();

			},

			constrainValue : function( val ){

				var self = this, 
					slider = self.state.slider.limits;

				if(val < slider.minimum){
					val = slider.minimum;
				}else if(val > slider.maximum){
					val = slider.maximum;
				}

				return val;	

			},

			convertUserValueToSliderValue : function( userValue){
				
				var self = this,
					sliderValue,
					p = self.getPercents();

				return Math.floor(p.slider * (userValue / p.user));

			},

			convertSliderValueToUserValue : function( sliderValue ){
				
				var self = this,
					p = self.getPercents();

				return Math.floor(p.user * ( sliderValue / p.slider ));

			},

			show : function(){
			
				var self = this;
				
				self.DOMElements.container.show();

			},

			hide : function(){
			
				var self = this;

				self.DOMElements.container.hide();	
				

			},

			getPercents : function(){
				var self = this,
					slider = self.state.slider,
					user = self.state.user,

					percents = {
						slider : (slider.limits.max - slider.limits.min) / 100,
						user : (user.max - user.min) / 100 
					};

					return percents;

			},

			handleSizeAsPercent : function( percent ){
				
				var self = this,
					slider = self.state.slider,
					user = self.state.user;
						
					slider.setHandleSize(Math.max(30, slider.container.size() * (percent / 100)));
					slider.handle.percent = percent;

				return self;
					
			},

			refreshHandle : function(){
			
				var self = this,
					slider = self.state.slider;
				if(slider.handle.percent){

					self.handleSizeAsPercent( slider.handle.percent );

				}else{
					slider.setHandleSize( 30 );

				}
				
				return self;	

			},

			parentResizedTo : function( size ){
			
				// an alias for resize.
				var self = this;
				
				self.resize(size);

				return self;

			},

			resize : function( size ){

				var self = this,
					user = self.state.user,
					slider = self.state.slider,
					DOM = self.DOMElements,
					attr = self.CSSAttributes;

				// if 'size' exists then the parent element has got new dimensions,
				// so we probably need to resize the slider's container and handle. 

				if(size){

					// but this hasn't yet been implemented.
					_.extend(slider.sizes.parent, size);

					slider.setContainerSize( slider.container.size() );

					self.refreshHandle();
					//slider.container.size = Math.floor( slider.parent.size() - (self.config.gutter * 2));
					
					// need to calculate a handle size based on the number of possible values between 
					// the user's min and max, and the limit min/max of the scrollbar. 

					// for now, stick to 50.

				}

				self.updateSliderLimits();

		
				if(user.max > user.min){

						DOM.container.hide();

				}else{

					DOM.container.show();

					if(window.Touch){

						DOM.container.css({
							visibility: 'hidden'
						});
						DOM.handle.css({
							visibility: 'visible', 
							opacity : 'none'
						});
						
					}

				}

				return self;

			},

			reset : function(){

				var self = this;

				self.scrollHandle.value = 0;
				self.resize();
				self.position(0);

				return self;
			},

			resetToCurrentPosition : function(){

				var self = this;

				self.resize();
				self.position(0);
				return self;

			}

		})

		/*

			Just for the sake of code readability I've moved these
			methods to another block as they

		*/

		.addInstanceMethods({
			
			bindMouseHandlers : function(){
				
				var self = this, mouseUp, DOM = self.DOMElements;

				DOM.container.bind('click', (function(){
					// rather than do this test on every click 
					// we simply return a callback that's executed
					// on subsequent calls to click.

					if(self.config.align==='horizontal'){

						return function(e){
							if(!$(e.target).is('div.slider-handle')){
								e.stopPropagation();
								e.preventDefault();

								if(e.offsetX){

									self.centerOn(e.offsetX);

								} else {
										// FIREFOX hack
										offset = $(e.target).offset();

										self.centerOn(e.clientY - offset.left);

									
								}

							}
					
						};

					}else{
									
						return function(e){
							if(!$(e.target).is('div.slider-handle')){

								var offset;

								e.stopPropagation();
								e.preventDefault();

								if(e.offsetY){

									self.centerOn(e.offsetY);

								} else {
									// FIREFOX hack
									offset = $(e.target).offset();

									self.centerOn(e.clientY - offset.top);

								}

								
							}

						};

					}

				}()));

				// the mouseUp handler... 

				mouseUp = function(e){

					// remove the mousemove handler...
					$(this).unbind('mousemove');

					$('body').css({
						cursor : 'default'
					});

					$(this).css({
						cursor: 'pointer'
					});

					// execute any custom user callback.
					if(self.config.onEnd){
						self.config.onEnd();
					}

					// stop listening for mouseup.
					$(document).unbind('mouseup', mouseUp);

				};

				DOM.handle.bind('mousedown', (function(){
			
					// again we we generate a callback here so this
					// test isn't run every time...
					if(self.config.align==='horizontal'){

						return function(e){

							// execute any custom user callback
							if(self.config.onStart){
								self.config.onStart();
							}

							e.stopPropagation();
							e.preventDefault();

							// persistence variables, available to callbacks as closure vars.
							var startX = e.clientX;
							var lastX = 0;

							$('body').css({
								cursor : 'W-resize'
							});
							$(this).css({
								cursor : 'W-resize'
							});
					
							$(document)
								.bind('mousemove', function(e){
										e.preventDefault();
											// where we move, taking into account the values from the last tick..
										self.position((lastX - (e.clientX - startX)) * -1);

											// then save for next time...
										lastX = e.clientX - startX;
										})

								.bind('mouseup', mouseUp);

						};

					}else{
									
						return function(e){

							if(self.config.onStart){
								self.config.onStart();
							}
							e.stopPropagation();
							e.preventDefault();

							var startY = e.clientY;
							var lastY = 0;

							$('body').css({
								cursor : 'N-resize'
							});
							$(this).css({
								cursor : 'N-resize'
							});

							$(document)
								.bind('mousemove', function(e){
										e.preventDefault();
											// where we move, taking into account the values from the last tick..
										self.position((lastY - (e.clientY - startY)) * -1);

											// then save for next time...
										lastY = e.clientY - startY;
										})
						
								.bind('mouseup', mouseUp);

						};

					}

				}()));

				return self;

			}

		})

}(NICE));