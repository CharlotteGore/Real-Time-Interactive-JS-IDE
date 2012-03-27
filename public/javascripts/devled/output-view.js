(function(devLed, NICE){

	devLed.addStaticProperties({

		output : NICE.app.feature.createChild()

	});

	devLed.output
		.addFeatureId({

			id : "output"

		})
		.addInstanceMethods({

			init : function(){

				var self = this;

				self.container = $('<div></div>');
				self.assertions = $('<div class="assertions"></div>');
				self.iframe = $('<iframe></iframe');
				self.scriptUri = '/javascripts/editable/scratch.js';
				self.iframe.attr('src', '/iframe_empty' + self.scriptUri);

				self.container
					.append(self.assertions)
					.append(self.iframe);

				return self;

			},
			handleResizeSignal : function( o ){
				
				var self = this;

				self.container.css({
					
					width : o.x - 20,
					height: o.y

				});

				self.assertions.css({
					
					width : o.x - 20,
					height: o.y

				});

				self.iframe.css({
					
					width : o.x - 20,
					height: 0

				});

				return self;

			}




		})
		.addSignalHandlers({

			"new file requested" : function( uri ){

				var self = this;

				self.scriptUri = uri.replace('.js', '.html');

				self.assertions.empty();

				//self.iframe.attr('src', '/iframe_empty' + self.scriptUri);

				return self;

			},

			"event code updated" : function( code ){

				var self = this;

				$('div.assert', self.assertions).addClass('expired');

				self.assertions.prepend('<div class="assert">'+ (new Date()).toLocaleTimeString() + ': Refresh</div>');

				self.iframe.attr('src', '/iframe_empty' + self.scriptUri);

				return self;
			},

			"new assertion" : function(assertion){

				var self = this;

				self.assertions.prepend('<div class="assert '+ assertion.result + '">' + (new Date()).toLocaleTimeString() + ': ' + assertion.description + ' (' + (assertion.result ? "PASS" : "FAIL") +')</assert>')

				return self;


			} 

		})


}(devLed, NICE));