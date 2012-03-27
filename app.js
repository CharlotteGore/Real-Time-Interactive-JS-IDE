
/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io')
  , stylus = require('stylus')
  , routes = require('./routes')
  , crapsync = require('./crapsync.js');

var app = module.exports = express.createServer();

crapsync.initialise(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/list/', crapsync.list);
app.get('/iframe_empty/*.*', routes.iframeEmpty);

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
