/// <reference path="../underscore/underscore.js" />

var base = function () { };

_.extend(base, {
    addStaticMethods: function addStaticMethods(methods) {
        _.extend(this, methods);
        return this;
    },

    addInstanceMethods: function addInstanceMethods(methods) {
        _.extend(this.prototype, methods);
        return this;
    },

    createChild: function createChild() {
        var child, method;
        child = function base(args) {
            var _this = this;
            if (this instanceof arguments.callee) {
                this.init.apply(this, args.callee ? args : arguments);
                if(this._postInit){
                    this._postInit();    
                }
                return this;
            } else {
                return new arguments.callee(arguments);
            }
        };
        _.extend(child, this);
        _.each(this.prototype, function(method, name){
            child.prototype[name] = method;
        });
        return child;
    }
});

_.extend(base, {
    addStaticProperties: base.addStaticMethods,
    addInstanceProperties: base.addInstanceMethods
});

base.addInstanceMethods({
    init: function (config) {
        return this;
    }
});

window.base = base;