/*
 * Bonus 2
 */

(function(){

    var unicorn = base.createChild();
    
    unicorn.addInstanceMethods({

        init : function(){
        
            var self = this;
                
            self.name = "Sparkles";
            self.awesomeness = Infinity;
            self.picture = $('<img src="/images/unicorn.jpg" />');
            
            
            $('div.assertions').prepend(self.picture);
            
            self.picture

                .css({
                    width: 200,
                    height: 200
                })
                .click(  // we pass click an anonymous function
                         // which we execute immediately.
                    (function(rider)
                    {
                        // then we return the function
                        // that will be executed when 
                        // the button is clicked
                        return function(event)
                        {
                            // and this function has
                            // access to the variable 
                            // 'rider'
                            assert(
                                "I'm being ridden by Robocop!",
                                rider,
                                "robocop"
                            );
                    
                        };
                    
                    }("robocop"))
                );
            
            return self;
            
        }
    
    });
    

    unicorn();

}());