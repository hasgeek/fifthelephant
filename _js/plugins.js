// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



// Place any jQuery/helper plugins in here/


// remap jQuery to $
(function($){

/**
 * Toggle grid for ninesixty
 * Created by: Emil Stjerneman - <http://www.anon-design.se> (anon - <http://drupal.org/user/464598>)
 *
 * Press "shift + g" to toggle 
 */
$(document).ready(function() {
  $(document).keypress(function(e){
    var target = e.target || e.srcElement;
    // Defeat Safari bug 
    if (target.nodeType==3) { 
      target = targ.parentNode;
    }
    // Prevent toggle of you are in a textarea for input field.
    if(target.tagName != "TEXTAREA" && target.tagName != "INPUT" && e.which==71 && e.shiftKey) {
      $('body').toggleClass('show-grid');
    }    
  });
});


})(this.jQuery);
