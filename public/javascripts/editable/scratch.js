

// This is an anonymous function, executed immediately 
(function(){

    // we declare a variable, which exists in the local scope.
    var hello = "hello";
    
    // see? ---->
    assert("hello exists here", hello, "hello");
    
    
}());

// but it doesn't exist in the global scope...
assert("hello doesn't exist here", typeof hello, "undefined");



