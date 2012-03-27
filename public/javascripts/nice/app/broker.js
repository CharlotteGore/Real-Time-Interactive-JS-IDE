/// <reference path="./app.js" />

(function(NICE){

    var socket = io.connect('http://localhost:3000');
    
    NICE.app.addStaticProperties({
        broker: base.createChild()
    });

    NICE.app.broker.addInstanceMethods({
        init: function () {
            var self = this;    

            socket.on('server broker publish', function(data){

                self.publishSignalsFromServer(data.signal, data.args);

            });


            self.subscribers = {};
            self.subscribersAsync = {};
            return this;
        },

        publishSignalsFromServer : function( signal, args ){
            var handler, i, args;
            if (!this.subscribers[signal]) {
                this.subscribers[signal] = [];
            }
            if (!this.subscribersAsync[signal]) {
                this.subscribersAsync[signal] = [];
            }
            args = Array.prototype.slice.call(arguments, 1);

            for (i = 0; i < this.subscribersAsync[signal].length; i = i + 1) {
                handler = this.subscribersAsync[signal][i];
                handler.apply(this, args);
            }
            for (i = 0; i < this.subscribers[signal].length; i = i + 1) {
                handler = this.subscribers[signal][i];
                handler.apply(this, args);
            }
            return this;

        },

        publish: function (signal) {
            var handler, i, args;
            if (!this.subscribers[signal]) {
                this.subscribers[signal] = [];
            }
            if (!this.subscribersAsync[signal]) {
                this.subscribersAsync[signal] = [];
            }
            args = Array.prototype.slice.call(arguments, 1);

            socket.emit("client broker publish", { signal: signal, args : args });

            for (i = 0; i < this.subscribersAsync[signal].length; i = i + 1) {
                handler = this.subscribersAsync[signal][i];
                handler.apply(this, args);
            }
            for (i = 0; i < this.subscribers[signal].length; i = i + 1) {
                handler = this.subscribers[signal][i];
                handler.apply(this, args);
            }
            return this;
        },

        subscribe: function (signal, scope, handlerName) {
            if (!this.subscribers[signal]) {
                this.subscribers[signal] = [];
            }
            var curryArray = Array.prototype.slice.call(arguments, 3);
            this.subscribers[signal].push(function () {
                var normalizedArgs = Array.prototype.slice.call(arguments, 0);
               // console.log([handlerName, scope, normalizedArgs]);
                scope[handlerName].apply((scope || window), curryArray.concat(normalizedArgs));
            });
            return this;
        },

        subscribeAsync: function (signal, scope, handlerName) {
            if (!this.subscribersAsync[signal]) {
                this.subscribersAsync[signal] = [];
            }
            var curryArray = Array.prototype.slice.call(arguments, 3);
            this.subscribersAsync[signal].push(function () {
                var normalizedArgs, func;
                normalizedArgs = Array.prototype.slice.call(arguments, 0);
                func = function () {
                    scope[handlerName].apply((scope || window), curryArray.concat(normalizedArgs));
                };
                setTimeout(function () {
                    func(arguments);
                }, 0);
            });
            return this;
        }

    });

    // we create a global broker, accessible to all.

    NICE.addStaticProperties({
        
        broker : NICE.app.broker()

    });

}(NICE));