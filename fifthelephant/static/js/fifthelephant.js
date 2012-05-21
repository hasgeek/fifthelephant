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
  $('.graphics_sessions .z-1').css('top', sess_height+500 + 'px');
  $('.graphics_sessions .z-2').css('top', sess_height+100 + 'px');
}
