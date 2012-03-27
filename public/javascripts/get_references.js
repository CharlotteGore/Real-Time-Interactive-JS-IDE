(function(top){

	window._ = top._;
	window.$ = top.parent.$;
	window.base = top.base;
	window.NICE = top.NICE;
	window.assert = top.assert;
	window.log = function(args){

			if(_.isArray(args)){

				_.each(args, function(a){

					window.$('body', document).append($('<p>' + args + '</p>'));

				})


			}else{

				window.$('body', document).append($('<p>' + args + '</p>'));

			}

		};
	window.onerror = function(e){

		window.console.log(e);

	}

}(top.window));