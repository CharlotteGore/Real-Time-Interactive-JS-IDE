	var fs = require('fs'),
		base = require('./base.js').base,
		dmp = require('./public/javascripts/diffmatchpatch/diff_match_patch').diffMatchPatch();


	var patcher = base.createChild();

	patcher
		.addInstanceMethods({

			init : function(){

				var self = this;

				self.raw = "";

				return self;

			}

		})
		.addAsyncInstanceMethods({

			patch : function( code, callback ){

				var self = this, 
					patches = dmp.patch_fromText(code);

				self.raw = dmp.patch_apply(patches, self.raw)[0];

				console.log(self.raw);

				fs.writeFile(self.fileName, self.raw, function(){

					callback();

				});

				return self;

			},

			getRaw : function( callback ){

				var self = this;

				callback(self.raw);

				return self;

			},

			loadFile : function( filename, callback ){

				var self = this;

				self.fileName = filename;
				self.reset( callback );

				return self;

			},

			reset : function( callback ){

				var self = this;
				self.raw = "";

				fs.readFile( self.fileName, function(err, data){

					if(!err){
						self.raw = data;

						callback(self);

					}

				});

				return self;

			}

		});

	exports.patcher = patcher;