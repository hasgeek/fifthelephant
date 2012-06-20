(function($) {
  /*
    jquery.twitter.js v1.0
    Last updated: 26 October 2008

    Created by Damien du Toit
    http://coda.co.za/blog/2008/10/26/jquery-plugin-for-twitter

    Updated by Kiran Jonnalagadda for Eventframe/The Fifth Elephant

    Licensed under a Creative Commons Attribution-Non-Commercial 3.0 Unported License
    http://creativecommons.org/licenses/by-nc/3.0/
  */

  $.fn.getTwitter = function(options) {
    var o = $.extend({}, $.fn.getTwitter.defaults, options);
  
    var relative_time = function(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
      delta = delta + (relative_to.getTimezoneOffset() * 60);

      if (delta < 60) {
        return 'less than a minute ago';
      } else if(delta < 120) {
        return 'about a minute ago';
      } else if(delta < (60*60)) {
        return (parseInt(delta / 60, 10)).toString() + ' minutes ago';
      } else if(delta < (120*60)) {
        return 'about an hour ago';
      } else if(delta < (24*60*60)) {
        return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        return '1 day ago';
      } else {
        return (parseInt(delta / 86400, 10)).toString() + ' days ago';
      }
    };

    // hide container element
    $(this).hide();
  
    // add heading to container element
    if (o.showHeading) {
      $(this).append('<h2>'+o.headingText+'</h2>');
    }

    // add twitter list to container element
    $(this).append('<ul class="twitter_update_list"><li></li></ul>');

    var twitterlist = $(this).find("ul.twitter_update_list");
    // hide twitter list
    twitterlist.hide();

    // add preLoader to container element
    var pl = $('<p id="'+o.preloaderId+'">'+o.loaderText+'</p>');
    $(this).append(pl);

    // add Twitter profile link to container element
    if (o.showProfileLink) {
      $(this).append('<a id="profileLink" href="http://twitter.com/'+o.userName+'">http://twitter.com/'+o.userName+'</a>');
    }

    // show container element
    $(this).show();
  
    // $.getScript("http://twitter.com/javascripts/blogger.js");
    // $.getScript("http://twitter.com/statuses/user_timeline/"+o.userName+".json?callback=twitterCallback2&count="+o.numTweets, function() {
    $.getJSON("http://twitter.com/statuses/user_timeline/"+o.userName+".json?callback=?", {count: o.numTweets}, function(tweets) {

      var statusHTML = [];
      var make_url = function(url) {
        return '<a href="'+url+'">'+url+'</a>';
      };
      var make_reply = function(reply) {
        return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
      };
      for (var i=0; i<tweets.length; i++) {
        var username = tweets[i].user.screen_name;
        var status = tweets[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s<\>]*[^.,;'">\:\s<\>\)\]\!])/g, make_url).replace(/\B@([_a-z0-9]+)/ig, make_reply);
        statusHTML.push('<li>'+status+' <small>(<a href="http://twitter.com/'+username+'/statuses/'+tweets[i].id_str+'">'+relative_time(tweets[i].created_at)+'</a>)</small></li>');
      }
      twitterlist.html(statusHTML.join(''));

      // remove preLoader from container element
      $(pl).remove();

      // show twitter list
      if (o.slideIn) {
        twitterlist.slideDown(1000);
      }
      else {
        twitterlist.show();
      }

      // give first list item a special class
      twitterlist.find("li:first").addClass("firstTweet");

      // give last list item a special class
      twitterlist.find("li:last").addClass("lastTweet");
    });
  };

  // plugin defaults
  $.fn.getTwitter.defaults = {
    userName: null,
    numTweets: 5,
    preloaderId: "preloader",
    loaderText: "Loading tweets...",
    slideIn: false,
    showHeading: true,
    headingText: "Latest Tweets",
    showProfileLink: true
  };
})(jQuery);
