
var my_timer;

$(document).ready(function(){
    start_timers();
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function start_timers() {
    // Do it until end of time
    try {
        clearInterval(my_timer);
    } catch(err) {
        console.log("No timer yet");
    }
    
    my_timer = setInterval(refresh_timers,1000);
}

function disable_buttons() {
    // Should the brew button be disabled?
    disable_seconds = 15;
    
    $('.coffee_button').each(function() { 
        brew_time = new Date(parseInt($('#timer_' + $(this).attr('pot_id')).attr('start_time')));
        current_time = new Date();
        
        if (current_time - brew_time <= disable_seconds*1000) {
            $(this).addClass('disable_button');
        } else {
            $(this).removeClass('disable_button');
        }
    });
}

function refresh_timers() {
    timers = $('.pot_timer');
    disable_buttons();
    
    timers.each( function() { 
        start_time = parseInt( $(this).attr('start_time') );
        if (isNaN(start_time)) { return; }
    
        parsed_brew_time = new Date(start_time);
        current_time = new Date();
        time_diff = current_time - parsed_brew_time;
        
        var hh = Math.floor(time_diff / 1000 / 60 / 60);
        time_diff -= hh * 1000 * 60 * 60;
        var mm = Math.floor(time_diff / 1000 / 60);
        time_diff -= mm * 1000 * 60;
        var ss = Math.floor(time_diff / 1000);
        time_diff -= ss * 1000;
                
        formatted_time = pad(hh, 2) + ':' + pad(mm, 2) + ':' + pad(ss, 2);
        this.innerHTML = formatted_time;
        
    });
    
}

