/*
 * Panda.js 0.3
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
                .click(function(event){
            
                    assert('My name is Sparkles!', self.name, "Sparkles");   
                
                });
            
            return self;
            
        }
    
    });
    

    unicorn();

}());