
var icons = {
  "11":"wi-day-sunny",
  "12":"wi-day-sunny-overcast",
  "13":"wi-day-cloudy",
  "14":"wi-day-cloudy",
  "15":"wi-cloud",
  "16":"wi-cloudy",
  "17":"wi-day-cloudy-high",
  "43":"wi-day-sprinkle",
  "44":"wi-day-sprinkle",
  "45":"wi-sprinkle",
  "46":"wi-sprinkle",
  "23":"wi-day-rain",
  "24":"wi-day-rain",
  "25":"wi-rain",
  "26":"wi-rain",
  "71":"wi-day-snow",
  "72":"wi-day-snow",
  "73":"wi-snow",
  "74":"wi-snow",
  "33":"wi-day-snow",
  "34":"wi-day-snow",
  "35":"wi-snow",
  "36":"wi-snow",
  "51":"wi-day-thunderstorm",
  "52":"wi-day-thunderstorm",
  "53":"wi-thunderstorm",
  "54":"wi-thunderstorm",
  "61":"wi-day-storm-showers",
  "62":"wi-day-storm-showers",
  "63":"wi-storm-showers",
  "64":"wi-storm-showers",
  "11n":"wi-night-clear",
  "12n":"wi-night-alt-partly-cloudy",
  "13n":"wi-night-alt-cloudy",
  "14n":"wi-night-alt-cloudy",
  "15n":"wi-cloud",
  "16n":"wi-cloud",
  "17n":"wi-night-alt-cloudy-high",
  "43n":"wi-night-alt-sprinkle",
  "44n":"wi-night-alt-sprinkle",
  "45n":"wi-sprinkle",
  "46n":"wi-sprinkle",
  "23n":"wi-night-alt-rain",
  "24n":"wi-night-alt-rain",
  "25n":"wi-rain",
  "26n":"wi-rain",
  "35n":"wi-snow",
  "36n":"wi-snow",
  "71n":"wi-night-alt-snow",
  "72n":"wi-night-alt-snow",
  "33n":"wi-night-alt-snow",
  "34n":"wi-night-alt-snow",
  "51n":"wi-night-alt-thunderstorm",
  "52n":"wi-night-alt-thunderstorm",
  "53n":"wi-thunderstorm",
  "54n":"wi-thunderstorm",
  "61n":"wi-night-alt-storm-showers",
  "62n":"wi-night-alt-storm-showers",
  "63n":"wi-storm-showers",
  "64n":"wi-storm-showers",
  "101":"wi-day-fog",
  "102":"wi-fog",
  "111":"wi-sleet",
  "112":"wi-hail",
  "121":"wi-dust",
  "131":"wi-sandstorm",
  "141":"wi-day-sunny",
  "142":"wi-snowflake-cold",
  "151":"wi-raindrop",
  "152":"wi-windy",
}
 
  moment.locale('en');
  var timezone = "America/Argentina/Buenos_Aires";

  var momentCalendarDefault = {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: 'dddd D',
    lastDay: "[Yesterday]",
    lastWeek: "[Last] dddd",
    sameElse: 'DD/MM/YYYY'
  };

  var aemet = new aemetLocale('en');
  
  var forecastDayContainer = function(day, forecast){
    
    var date = moment(day);
    
    var temp_max = forecast.temperature != null && forecast.temperature.max != null && forecast.temperature.max !== '' ? forecast.temperature.max.toFixed(0)+'&deg;' : '';
    var temp_min = forecast.temperature != null && forecast.temperature.min != null && forecast.temperature.min !== '' ? forecast.temperature.min.toFixed(0)+'&deg;' : '';
    
    if(forecast.rain != null){
        if(forecast.rain.probability != null){
            var rain = forecast.rain.probability;
        }else if(forecast.rain.max != null){
            var rain = forecast.rain.max;          
        }else{
            var rain = '';
        }
    }else{
        var rain = '';
    }
    
    // Save code weather
    var code = forecast.weather != null && forecast.weather.code !== '' ? forecast.weather.code : '';
    // If code weather doest exist, and we haver rain probability, rain max and cloud coverage, deduct new code with that data
    if((forecast.weather == null || forecast.weather.code === '') && forecast.clouds != null && forecast.rain != null){
        code = weatherCode(forecast.clouds, forecast.rain.max, forecast.rain.probability);
    }
    
    return  '<li>'+
      '<div class="text-center forecast-day-container" style="min-width:110px; margin-right:10px; ">'+
        '<div style="padding:5px">'+
          '<span style="text-transform: capitalize;">'+date.calendar(null, momentCalendarDefault)+'</span>'+
        '</div>'+
        '<a class="link-grey" rel="tooltip" title="'+aemet.t(code)+'">'+
          '<div style="padding:5px; min-height:30px;">'+
            '<span '+(rain?'class="forecast-day-icon"':'')+'><i class="forecast-icon wi '+icons[code]+'" style="font-size:2em;"></i></span>'+
            (rain?'<span class="forecast-day-rain"><i class="forecast-icon wi wi-umbrella"></i> '+rain+(forecast.rain.probability != null  ?' %':' mm')+'</span>':'')+
          '</div>'+
        '</a>'+
        '<div style="padding:5px">'+
          '<span style="color:#b00; font-size:120%;">'+temp_max+'</span> &nbsp; '+
          '<span style="color:#08b; font-size:120%;">'+temp_min+'</span>'+
        '</div>'+
      '</div>'+
    '</li>';
  }
  
  function forecastDailyCallback(data){
    
    var i = 0;
    $('#forecast-container').empty();
    
    if(data.info == null || data.forecast.length == 0){
      $('#forecast-container').html('<li style="margin-top:20px;">Forecast not available at this moment</li>');
      return;
    }
    
    $('#meteo-source').html('&copy;&nbsp;'+data.info.source).attr('href',data.info.web);
    $('#meteo-location').html(data.location.name);
    
    for(var dayForecast in data.forecast){
      $('#forecast-container').append(forecastDayContainer(dayForecast, data.forecast[dayForecast]));
      i++;
      if(i>4) break;
    }
    
  }

  function getForecastDaily(){
   $.ajax({
        dataType:"json",
        data:{'id':'2533437581', WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
        type: "get",
        url: '/forecast/daily',
        timeout: 20000,
        success:forecastDailyCallback,
        error: function(){
            $('#forecast-container').html('<li style="margin-top:20px;">Forecast not available at this moment</li>');
        },
   })
}

$(document).ready(function(){  
    setTimeout(getForecastDaily, 0);
    setInterval(getForecastDaily, 3600000);
});

// Modal trigger only on main image
$(document).on('click', '.open-gallery-modal', function(e) {
  e.preventDefault();
  var index = $(this).data('index');
  $('#profile-gallery-modal').modal('show');
  $('#profile-gallery-modal .carousel').carousel(index);
});

// Tab thumbnail click switches main image/tab
$(document).on('click', '.profile-gallery-thumb', function(e) {
  e.preventDefault();
  var tabId = $(this).data('tab');
  // Activate tab
  $(this).closest('ul').find('li').removeClass('active');
  $(this).parent('li').addClass('active');
  $(this).closest('.tabbable').find('.tab-pane').removeClass('active');
  $('#' + tabId).addClass('active');
});
