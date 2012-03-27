/// <reference path="./app.js" />

(function(NICE) {

	// this is a stub

	NICE.app.addStaticProperties({

		linqData: base.createChild()

	});

	NICE.app.linqData.addInstanceMethods({

		init: function() {

			this._data = {};
			return this;

		},

		query: function() {

			return Enumerable.From(this._data);

		},

		merge : function(data) {
			
			_.extend(this._data, data)
			return this;

		}

	});
	
})(NICE);