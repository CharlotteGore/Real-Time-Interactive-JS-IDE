(function(devLed, NICE){

	devLed.addStaticProperties({

		code : NICE.app.feature.createChild()

	});

	devLed.code
		.addFeatureId({

			id : "code"

		})
		.addInstanceMethods({

			init : function(){

				var self = this,
					mode;

				self.container = $('<div></div>');
				self.diffMatchPatch = new diff_match_patch();

				self.connected = false;
				self.ready = false;
				self.editing = false;

				self.container.empty();

				self.editor = ace.edit( self.container[0] );
				self.editor.setTheme("ace/theme/twilight");

				mode = ace.require("ace/mode/javascript").Mode;
				self.session = self.editor.getSession()
				self.session.setMode(new mode());
				self.session.setUseWrapMode(true);
				self.session.setWrapLimitRange(null, null);
				self.editor.renderer.setHScrollBarAlwaysVisible(false);

				self.session.on('change', function(){

					self.codeChanged();

				});

				return self;

			},

			codeChanged : function(){

				var self = this,
					code = self.session.getValue(),
					length = code.split('\n').length,
					diff;

				if(self.editing){

					if(length!==self.numLines){

						if(jslint.jslint(code)){

							diff = self.diffMatchPatch.patch_toText(
								self.diffMatchPatch.patch_make(self.code, code)
							)

							self.code = code;

							NICE.broker.publish('request update code', diff);

						}else{

							console.log(jslint.errors);

						}

						self.numLines = length;

					}

				}

			},
			handleResizeSignal : function( o ){
				
				var self = this;

				self.container.css({
					
					width : o.x,
					height: o.y

				});

				return self;

			}
		})
		.addFeatureStates({

			"load-script" : function( uri ){

				var self = this;

				if(!self.ready){

					setTimeout(function(){

						self["load-script"]( uri );

					}, 100)

					return self;

				}

				self.sourceUri = uri;
				self.code = "";

				self.editing = false;
				self.session.setValue('');

				NICE.broker.publish('new file requested', uri);

				return self;

			}

		})
		.addDelegates({

			"switchTo" : {

				selector : 'a[rel="/rels/switch-to"]',
				event : 'click',
				callback : function(event, state, element){

					state.request({
							command : 'load-script',
							arg: $(element).attr('href')
					});
					
					return true;

				}

			}

		})
		.addSignalHandlers({

			"connected" : function(){

				// brand new connection.
				var self = this;

				if(!self.working){

					self.connected = true;

					NICE.broker.publish('code editor initialised');

				}else{

					self.ready = false;
					self.working = false;
					self.forceReload();

				}

				return self;

			},

			"ready for new file request" : function(){

				var self = this;

				self.ready = true;

				return self;

			},

			"ready for updates" : function(){

				var self = this;



				$.ajax({
					url : self.sourceUri,
					cache: false,
					success : function(data){
						self.code = data;
						self.numLines = self.code.split(/\n/g).length;

						self.editor.insert(self.code);
						//self.session.setValue(data);

						//setTimeout(function(){

							self.editing = true;

						//},500);
						//self.editing = true;
						self.working = true;

					}

				});

				return self;

			},

			"file updated" : function(){

				NICE.broker.publish('event code updated');

			}

		})


}(devLed, NICE));