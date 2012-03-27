(function(NICE){

	var devLed = base.createChild();

	devLed.addInstanceMethods({


		init : function(){

				var self = this,
					initialWindow = {
						height: $(window).outerHeight(),
						width: $(window).outerWidth()

					};

				if(!NICE.broker || !NICE.hash){
					
					throw("Unable to initialise Dev Led Training. Dependencies not met");

				}

	
				
				$.extend(self, {
					appView : NICE.ui.twoColumnView({
						
						left : 600,


						right : 'auto',
			
						
						divider :  4	
					}),
					code : devLed.code(),
					output : devLed.output()


				});

				/*

					we want to attach appView to div#sds, the place that has been
					set aside for the dynamic web application managed by this code.

					We tell it to listen out for the 'window resized' signal, which 
					will tell it it's new size. 

				*/
				self.appView
						.appendTo( $('#app') )
						.resizeOn('window resized');


				 
				self.code
						.listenForSignals()
						.attachToView( self.appView.left() )
						.onBusy( "left panel busy" )
						.onReady( "left panel ready" )
						.resizeOn( "left panel resized" );

				self.output
						.listenForSignals()
						.attachToView( self.appView.right() )
						.onBusy( "right panel busy" )
						.onReady( "right panel ready" )
						.resizeOn( "right panel resized" );


				/*

					Now we create a NICE.ui.windowMontor object, and give it a callback
					to run whenever it detects the screensize has changed.

				*/

				NICE.ui.windowMonitor( (function(){
						
							// here we calculate any explicit screen elements
							// that subtract from the available screen space
							// available for the real SDS application. 
						var pageHeader = $('#header'),
							headerSize = function(){ 

								return pageHeader.outerHeight();
							};

						return function(size){

							NICE.broker.publish('window resized', {
								
								x : size.x,
								y : size.y - headerSize()

							});

						};

					}())
				);

				/*
					we're going to configure how NICE.hash and the features
					are going to interact. We want the hasher to listen for 'feature request'
					signals, and publish 'feature action' signals. 

					we're also going to set up the default state for each of the 
					features used by this application. 


				*/ 

				NICE.hash
					.setDefault({
						code : {
							command : "load-script",
							arg : "/javascripts/editable/scratch.js"
						},
						output : {
							command : "blank"
						}
					});

				/*

					We'll manually trigger a hashchange event so that whatever
					the initial hash might be is picked up and actioned

				*/

				$(window).trigger("hashchange");

				NICE.broker.publish('DevLed Initialisation Complete');

				return self;

		}

	});


	window.devLed = devLed;

	$(document).ready(function(){

		devLed();

	})


}(NICE, window));
