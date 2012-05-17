$(function() {
  $('.navbar a').smoothScroll({
      offset: -90
    , speed: 900
  });
  pos_init();
  $('.graphics_home div').plaxify();
  $('.graphics_srosnops div').plaxify();
  $('.graphics_sessions div').plaxify();
  $.plax.enable();

  
});

function pos_init()
{
  var home_height = $('#home').offset().top;
  $('.graphics_home .z-1').css('top', home_height+300 + 'px');
  $('.graphics_home .z-2').css('top', home_height+150 + 'px');
  $('.graphics_home .z-3').css('top', home_height+100 + 'px');

  var spons_height = $('#srosnops').offset().top;
  $('.graphics_srosnops .z-1').css('top', spons_height+530 + 'px');
  $('.graphics_srosnops .z-2').css('top', spons_height+100 + 'px');
  $('.graphics_srosnops .z-3').css('top', spons_height-130 + 'px');

  var sess_height = $('#sessions').offset().top;
  $('.graphics_sessions .z-1').css('top', sess_height+930 + 'px');
  $('.graphics_sessions .z-2').css('top', sess_height+550 + 'px');
}

$(function() {
    var map = new L.Map('map');
    var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        subDomains = ['otile1','otile2','otile3','otile4'],
        cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
        var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib, subdomains: subDomains});

        var venue = new L.LatLng(12.94306, 77.59682); // geographical point (longitude and latitude)
        var center = new L.LatLng(12.946, 77.61);
        map.setView(center, 14).addLayer(cloudmade);
        if (map.getSize().x < 768) { map.setView(venue,14); } // on smaller screen where map takes full-width

        var venue_marker = new L.Marker(venue);
        map.addLayer(venue_marker);
        venue_marker.bindPopup('NIMHANS Convention Center').openPopup();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        
        map.on('zoomend', onZoomend);
        function onZoomend(){ map.setView(venue, map.getZoom()); };
  });