/*
 * Panda.js 0.1
 */

// DON'T DO THIS

// set some evil global variables
var panda_food_levels = 0;
var panda_is_asleep = false;

// create some evil global named functions
function panda_eat_bamboo(){

    // increment one of the global variables... yikes.
    panda_food_levels++;

}

function panda_wake_up(){

    // change another global variable.
    panda_is_asleep = false;
    
    // just assert that when this function runs, we can see
    // the evil global variable. 
    

    assert('panda_food_levels should be 1', panda_food_levels, 1);

}
 
function panda_go_to_sleep(){

    // change another global variable..
    panda_is_asleep = true;
    
    // then create a timeout to execute a global function 
    // in 100 milliseconds.
    setTimeout(panda_wake_up, 100);

}

// and then run them. 
panda_eat_bamboo();
panda_go_to_sleep();





