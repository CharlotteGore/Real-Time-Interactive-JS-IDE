 var 
 	io = require('socket.io'),
 	fs = require('fs'),
 	patcher = require('./patcher').patcher;
 	


 exports.list = function(req, res){
 	fs.readdir('./public/editable/', function(err, data){

 		if(!err){

 			res.render(data);

 		}

 	});
 };

 exports.initialise = function(app){

 	io = io.listen(app);

 	begin();

 };

 var begin = function(){

	io.sockets.on('connection', function (socket) {

	 var file = patcher();

	  socket.on('client broker publish', function (data) {

	  	if(signalHandlers[data.signal]){
	  		signalHandlers[data.signal].call( this, data, file, socket );
	  	}

	  });

	  socket.emit('server broker publish', {signal : 'connected'});
	  
	});

 }


var signalHandlers = {

	"code editor initialised" : function(data, file, socket){

		socket.emit('server broker publish', {signal : 'ready for new file request'});

	},
	"new file requested" : function(data, file, socket){

		file.loadFile('./public' + data.args[0], function(){

			socket.emit('server broker publish', {signal : 'ready for updates'});

		});
		
	},
	"request update code" : function(data, file, socket){

		file.patch(data.args[0], function(){

			socket.emit('server broker publish', {signal : 'file updated'});

		});
		

	}

}


