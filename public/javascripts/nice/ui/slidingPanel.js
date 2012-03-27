/// <reference path="./ui.js" />
/// <reference path="./slider.js" />
/// <reference path="./tween.js" />
/// <reference path="../../jquery/plugins/jquery-mousewheel.js" />

/*
	
	Usage: 

*/

(function(NICE){
	
	NICE.ui.addStaticMethods({
		
		slidingPanel : base.createChild()

	});

	NICE.ui.slidingPanel
		.addInstanceMethods({
			
			init : function ( jqElement, config ) {

				var self = this, user, scroller, slider;

				// the user's content - a reference to the element
				// that holds it, and its height.
				self.state = {
					
					user : {
					
						window : jqElement,
						height : function(){
							
							return self.state.user.window.outerHeight();

						},
						width : 0

					},

					scroller : {

						window: (function(){
							
							var element = $('<div></div>');
							element
								.addClass('clip-window NICE-ui-scroller')
								.css({
									
									'overflow' : 'hidden'

								});

							return element;

						}()),

						height : function(){
							
							return self.state.scroller.window.outerHeight(true);

						},

						limits : {
							
							min : 0,
							max : 0

						}

					}

				};


				// if the content is longer than the scroller has
				// space for, we're going to need a scroller handle 
				// to let the user scroll up and down. 

				// Here we create a *default* config,
				// which we then add the user's own
				// config to.

				self.config = {

					// so far there's no configuration just for the scrolling panel...
					padding: 8,
					slider : {
						
						parent : self.state.scroller.window,
						callback : function(val){
							
							self.position( val );

						},
						size: 8,
						align: 'vertical',
						gutters : {
							horizontal :5,
							vertical : 5
						}

					}
				}

				if (config) {
					_.extend(self.config, config);
				}

				// collapse some references... 
				user = self.state.user;
				scroller = self.state.scroller;

				// we reset the size and make sure we've got position:relative..

				user.window
					.css({
						
						position: 'relative'

					})
					// then make the user's content window a child
					// of the scroller window, which itself is appended
					// to the DOM as the previous sibling of the user's 
					// content.
					.before( scroller.window )
					.appendTo( scroller.window );

				if(window.Touch){
					
					self.bindTouchHandlers();

				}else{
					
					self.bindMouseHandlers();

				}
				// create a scrollbar object.

				self.slider = NICE.ui.slider( self.config.slider );

				var bestGuess = {
					
					width: scroller.window.parent().outerWidth(true),
					height: scroller.window.parent().outerHeight(true)

				}

				if(typeof bestGuess.width === 'number' && typeof bestGuess.height === 'number'){
					
					self.resize(bestGuess);

				}

				return this;
			},

			position : (function ( ){

				// we hide the position inside a closure
				var pos = 0;

				return function( val, rel ){

					var self = this, scroller = self.state.scroller;
				
					if(rel && rel==="rel"){
						val = val + pos;
					}

					if(arguments.length > 0){

						if(val > scroller.limits.min){
							pos = 0;
						}else if(val < scroller.limits.max){
							pos = scroller.limits.max;
						}else{
							pos = Math.floor( val );
						}

						self.css({ top : pos });

						self.slider.value( pos  );

					}else{

						return pos;

					}
				};	
			}()),

			empty : function(){
			
				var self = this;

				self.state.user.window.empty();

				self.resize();	
				
				return self;

			},

			scrollToTop : function(){
			
				var self = this;
				self.position(0);
				
				return self;	

			},

			scrollToElement : function(selector){
				
				// shouldn't be too hard...

			},

			resize : function( o ){
				
				var self = this, 
					scroller = self.state.scroller, 
					user = self.state.user, 
					config = self.config;

				if( o && o.width && o.height ){
					
					// some external force is attempting to resize the scroller
					// window.
					scroller.window
						.css({
							width: o.width,
							height: o.height

						});


					// communicate the new size to the slider so it can
					// redraw itself.

					user.window.css({

						width : o.width - config.padding

					});

					user.width = o.width;



					self.slider.parentResizedTo({
						width : o.width,
						height : o.height
					});

				}


				scroller.limits.max = (user.height() - scroller.height()) * -1 ;
				scroller.limits.min = 0;

				// communicate the new limits to the slider. Values passed back 
				// will be between these values.

				if(scroller.limits.max > 0 ){

					scroller.limits.max = 0;
					self.position(0);

					self.slider.hide();

				}else{

					self.slider
						.limits({
							minimum : scroller.limits.min,
							maximum : scroller.limits.max
						})
						.handleSizeAsPercent( scroller.height() / (user.height() / 100) )
						.show();

					//user.window.css({

					//	width : user.width - config.padding - (config.slider.gutters.horizontal) * 2 - config.slider.size

					//});

				}

				return self;

			},

			content : function(){
				
				var self = this;

				// returns a reference to the user's element.

				return self.state.user.window;

			},

			css : function( o ){
				
				var self = this;

				self.state.user.window.css( o );

				// just in case this changes the layout in some way.
				//self.resize();

				return self;

			},

			html : function( html ){
				
				var self = this;
				self.state.user.window
					.empty()
					.html( html );

				self.resize();

				return self;
			},

			append : function( element ){
				
				var self = this;

				self.state.user.window.append( element );

				self.resize();

				return self;

			}

		})

		/*

			Just for the sake of code readability I've moved these
			methods to another block as they

		*/

		.addInstanceMethods({
			
			bindTouchHandlers : function(){
			
				var startDrag, self = this;

				startDrag = function ( event ) {

					function moveDrag( event ) {
						if ( event.touches.length === 1 ) {
							var currentPos = getCoors(event);
							//var deltaX = currentPos[0] - origin[0];
							var deltaY = currentPos[1] - origin[1];

							self.position(initialPosition + (currentPos[1] - origin[1]));

							return false; // cancels scrolling
						}
					}

					function getCoors( event ) {
						var coors = [];
						if ( event.targetTouches && event.targetTouches.length ) {	// iPhone

							var thisTouch = event.targetTouches[0];
							coors[0] = thisTouch.clientX;
							coors[1] = thisTouch.clientY;

						} else {	// all others

							coors[0] = event.clientX;
							coors[1] = event.clientY;

						}
						return coors;
					}

					this.ontouchmove = moveDrag;

					this.ontouchend = function () {

						this.ontouchmove = null;
						this.ontouchend = null;
						this.ontouchstart = startDrag; // Dolfin

					};

					var origin = getCoors(event);

					var initialPosition = self.position();

				};

				self.state.scroller.window[0].ontouchstart = startDrag;

				return self;	

			},

			bindMouseHandlers : function(){
				
				var self = this;
					// bind mousewheel functionality...
				self.state.scroller.window
					.bind('mousewheel', function ( event, delta ) {

						event.preventDefault();
						// invoke the moveRelative method..
						self.position(delta * 100, 'rel');

					});

			}

		})

}(NICE))