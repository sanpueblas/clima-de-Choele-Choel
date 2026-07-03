
function roundZero(value){
    var val = value.toFixed(0);
    return val === '-0'? 0 : val;
}

var weatherStatus = {
  'clear':{
        'day':{ icon:'wi-day-sunny', text:'Sunny', bg:'color-sky-day-1' },
        'night':{ icon:'wi-night-clear', text:'Clear', bg:'color-sky-night-1' },
    },
  'few':{
        'day':{ icon:'wi-day-cloudy-high', text:'Mostly sunny', bg:'color-sky-day-2' },
        'night':{ icon:'wi-night-alt-cloudy-high', text:'Mostly clear', bg:'color-sky-night-2' },
    },
  'change':{
        'day':{ icon:'wi-day-cloudy', text:'Mostly cloudy', bg:'color-sky-day-3' },
        'night':{ icon:'wi-night-alt-cloudy', text:'Mostly cloudy', bg:'color-sky-night-3' },
    },
  'cloud':{
        'day':{ icon:'wi-cloud', text:'Cloudy', bg:'color-sky-day-4' },
        'night':{ icon:'wi-cloud', text:'Cloudy', bg:'color-sky-night-4' },
    },
  'clear-fog':{
        'day':{ icon:'wi-day-haze', text:'Sunny with fog', bg:'color-sky-day-1' },
        'night':{ icon:'wi-night-fog', text:'Clear with fog', bg:'color-sky-night-1' },
    },
  'few-fog':{
        'day':{ icon:'wi-day-fog', text:'Mostly sunny with fog', bg:'color-sky-day-2' },
        'night':{ icon:'wi-night-fog', text:'Mostly clear with fog', bg:'color-sky-night-2' },
    },
  'change-fog':{
        'day':{ icon:'wi-day-fog', text:'Mostly cloudy with fog', bg:'color-sky-day-3' },
        'night':{ icon:'wi-night-fog', text:'Mostly cloudy with fog', bg:'color-sky-night-3' },
    },
  'cloud-fog':{
        'day':{ icon:'wi-fog', text:'Cloudy with fog', bg:'color-sky-day-4' },
        'night':{ icon:'wi-fog', text:'Cloudy with fog', bg:'color-sky-night-1' },
    },
  'light':{
        'day':{ icon:'wi-sprinkle', text:'Light rain', bg:'color-sky-day-5' },
        'night':{ icon:'wi-sprinkle', text:'Light rain', bg:'color-sky-night-5' },
    },
  'moderate':{
        'day':{ icon:'wi-showers', text:'Moderate rain', bg:'color-sky-day-6' },
        'night':{ icon:'wi-showers', text:'Moderate rain', bg:'color-sky-night-6' },
    },
  'heavy':{
        'day':{ icon:'wi-rain', text:'Heavy rain', bg:'color-sky-day-7' },
        'night':{ icon:'wi-rain', text:'Heavy rain', bg:'color-sky-night-7' },
    },
  'snow':{
        'day':{ icon:'wi-snow', text:'Snow', bg:'color-sky-day-7' },
        'night':{ icon:'wi-snow', text:'Snow', bg:'color-sky-night-7' },
    },
  'error':{
        'day':{ icon:'icon icon-question-sign', text:'Not available', bg:'color-sky-day-0' },
        'night':{ icon:'icon icon-question-sign', text:'Not available', bg:'color-sky-night-0' },
    },
};

var _cardinals = [
    "N","NNE","NE","ENE",
    "E","ESE","SE","SSE",
    "S","SSW","SW","WSW",
    "W","WNW","NW","NNW",
];
var _cardinalsEn = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

var unitsCode = {
    temp:0,
    hum:0,
    wspd:0,
    rain:0,
    rainrate:0,
    solarrad:0,
    bar:0,
};

var formatter = {};

formatter['temp'] = ({
  0:function(e){return e;},
  1:function(e){return (e - 32)/1.8;}
})[unitsCode.temp];

formatter['wspd'] = ({
  0:function(e){return e;},
  1:function(e){ return e/3.6;},
  2:function(e){ return e/2.236936292;},
  3:function(e){return e/1.943844492;}
})[unitsCode.wspd];

formatter['bar'] = ({
  0:function(e){return e;},
  1:function(e){ return e;},
  2:function(e){return e/0.7500616827;},
  3:function(e){return e/0.02952998751;}
})[unitsCode.bar];

formatter['rain'] = ({
  0:function(e){return e;},
  1:function(e){return e/0.0393701;}
})[unitsCode.rain];

formatter['temp2'] = ({
  0:function(e){return e != null ? (e*1).toFixed(1) : e;},
  1:function(e){return e != null ? ((e*1.8) + 32).toFixed(1) : e;}
})[unitsCode.temp];

formatter['wspd2'] = ({
  0:function(e){return e != null ? (e*1).toFixed(1) : e;},
  1:function(e){ return e != null ? (e*3.6).toFixed(1) : e;},
  2:function(e){ return e != null ? (e*2.236936292).toFixed(1) : e;},
  3:function(e){return e != null ? (e*1.943844492).toFixed(1) : e;}
})[unitsCode.wspd];

formatter['bar2'] = ({
  0:function(e){return e != null ? (e*1).toFixed(1) : e;},
  1:function(e){ return e != null ? (e*1).toFixed(1) : e;},
  2:function(e){return e != null ? (e*0.7500616827).toFixed(1) : e;},
  3:function(e){return e != null ? (e*0.02952998751).toFixed(1) : e;}
})[unitsCode.bar];

formatter['rain2'] = ({
  0:function(e){return e != null ? (e*1).toFixed(1) : e;},
  1:function(e){return e != null ? (e*0.0393701).toFixed(2) : e;}
})[unitsCode.rain];

var globalVariables = {
    temp:{icon:'wi-thermometer', unit: ' °C', name: 'Temperature'},
    dew:{icon:'wi-thermometer-exterior', unit: ' °C', name: 'Dew point'},
    hum:{icon:'wi-humidity', unit: ' %', name: 'Humidity'},
    bar:{icon:'wi-barometer', unit: ' hPa', name: 'Atmospheric pressure'},
    wind:{icon:'wi-strong-wind', unit:  '', name: 'Wind'},
    wspdavg:{icon:'wi-strong-wind', unit: ' m/s', name: 'Average wind speed'},
    wdiravg:{icon:'wi-strong-wind', unit: '°', name: 'Average wind direction'},
    rain:{icon:'wi-umbrella', unit: ' mm', name: 'Rain'},
    rainrate:{icon:'wi-raindrops', unit: ' mm/h', name: 'Rain rate'},
    dist:{icon:'', unit: ' m', name: 'dist'},
    uvi:{icon:'wi-hot', unit: '', name: 'UV index'},
    solarrad:{icon:'wi-day-sunny', unit: ' W/m²', name: 'Solar radiation'},
    vis:{icon:'wi-windy', unit: ' m', name: 'Visibility'},
}

var moons = {
    0:{icon:'wi-moon-alt-full', text:'New moon'},
    1:{icon:'wi-moon-alt-waning-gibbous-1', text:'Waxing crescent'},
    2:{icon:'wi-moon-alt-waning-gibbous-2', text:'Waxing crescent'},
    3:{icon:'wi-moon-alt-waning-gibbous-3', text:'Waxing crescent'},
    4:{icon:'wi-moon-alt-waning-gibbous-4', text:'Waxing crescent'},
    5:{icon:'wi-moon-alt-waning-gibbous-5', text:'Waxing crescent'},
    6:{icon:'wi-moon-alt-waning-gibbous-6', text:'Waxing crescent'},
    7:{icon:'wi-moon-alt-third-quarter fa-lg', text:'First quarter'},
    8:{icon:'wi-moon-alt-waning-crescent-1', text:'Waxing gibbous'},
    9:{icon:'wi-moon-alt-waning-crescent-2', text:'Waxing gibbous'},
    10:{icon:'wi-moon-alt-waning-crescent-3', text:'Waxing gibbous'},
    11:{icon:'wi-moon-alt-waning-crescent-4', text:'Waxing gibbous'},
    12:{icon:'wi-moon-alt-waning-crescent-5', text:'Waxing gibbous'},
    13:{icon:'wi-moon-alt-waning-crescent-6', text:'Waxing gibbous'},
    14:{icon:'wi-moon-alt-new', text:'Full moon'},
    15:{icon:'wi-moon-alt-waxing-crescent-1', text:'Waning gibbous'},
    16:{icon:'wi-moon-alt-waxing-crescent-2', text:'Waning gibbous'},
    17:{icon:'wi-moon-alt-waxing-crescent-3', text:'Waning gibbous'},
    18:{icon:'wi-moon-alt-waxing-crescent-4', text:'Waning gibbous'},
    19:{icon:'wi-moon-alt-waxing-crescent-5', text:'Waning gibbous'},
    20:{icon:'wi-moon-alt-waxing-crescent-6', text:'Waning gibbous'},
    21:{icon:'wi-moon-alt-first-quarter', text:'Last quarter'},
    22:{icon:'wi-moon-alt-waxing-gibbous-1', text:'Waning crescent'},
    23:{icon:'wi-moon-alt-waxing-gibbous-2', text:'Waning crescent'},
    24:{icon:'wi-moon-alt-waxing-gibbous-3', text:'Waning crescent'},
    25:{icon:'wi-moon-alt-waxing-gibbous-4', text:'Waning crescent'},
    26:{icon:'wi-moon-alt-waxing-gibbous-5', text:'Waning crescent'},
    27:{icon:'wi-moon-alt-waxing-gibbous-6', text:'Waning crescent'},
    28:{icon:'wi-moon-alt-full', text:'New moon'},
}

function getProfileValues(){
    var code = "2533437581";
    
    $.ajax({
        dataType:"json",
        type: "GET",
        url: '/device/values/'+code,
        beforeSend:function(){},
        success:function (data) {
          var now = new Date();
          
          var sun = SunCalc.getTimes(now, -39.2800619, -65.6597449);
          var dayOrNight = sun.sunrise < now && sun.sunset > now ? 'day' : 'night';
          
          var clouds = cloudsHeigth(formatter.temp(data.temp), formatter.temp(data.dew));
          
          var raining = data.rainrate != null ? formatter.rain(data.rainrate) : -1000;
          
          var currentConditions = guestCurrentConditions(
              formatter.bar(data.bar), 
              raining, 
              clouds,
              formatter.temp(data.temp)
          );
                  
          var nowcast = weatherStatus[currentConditions][dayOrNight];
          
          var _today = (new Date()).setHours(12, 0, 0);
          var curPhase = (SunCalc.getMoonIllumination(_today).phase*28).toFixed(0);
          
          // Nowcast
          $('#nowcast-icon').html('<i id="nowcast-icon" class="forecast-icon wi '+nowcast.icon+'" style="font-size:3em; line-height:1.2em;"></i>');
          $('#nowcast-text').html(nowcast.text);
          
          // Temps and feels like
          $('#nowcast-temp').html(isNaN(data.temp) ? '-' : roundZero(+data.temp));
          $('#nowcast-temp-unit').html(globalVariables.temp.unit);
          var feels = isNaN(data.temp) ? '-' : roundZero(+formatter.temp2(feel(formatter.temp(data.temp), data.hum, formatter.wspd(data.wspdavg))));
          var feelsText = isNaN(feels) ? '-' : feels + '°';
          $('#nowcast-feels').html( "Feels like <strong>"+feelsText+"</strong>");
                      
          // Wind, bar and Clouds height
          var _wdirValue = ' <i class="wi wi-strong-wind" style="font-size:120%;color:#0088BB"></i> <strong>Calm</strong>';
          if(+data.wspdavg > 0){
            $('#nowcast-wspd').html((isNaN(data.wspdavg) ? '-' : '<strong>'+roundZero(+data.wspdavg)+'</strong>')+' <small>'+globalVariables.wspdavg.unit+'</small>');
            _wdirValue = '&nbsp; <i class="wi wi-direction-up wi-from-'+degreeToCardinal(data.wdiravg, _cardinalsEn).toLowerCase()+'" style="font-size: 150%;color:#0088BB"></i>&nbsp; <strong>'+degreeToCardinal(data.wdiravg)+'</strong>';
          }
          $('#nowcast-wdir').html(isNaN(data.wdiravg) ? '' : _wdirValue);
           
                    $('#nowcast-bar').html((isNaN(data.bar) ? '-' : '<strong>'+data.bar.toFixed(1)+'</strong>')+' <small>'+globalVariables.bar.unit+'</small>');
          $('#nowcast-clouds').html((isNaN(clouds) || clouds < 0 ? '-' : '<strong>'+roundZero(+clouds)+'</strong>')+' <small>'+globalVariables.dist.unit+'</small>');
          
          $('#nowcast-moonphase').html('<i class="wi '+moons[curPhase].icon+'" style="font-size:120%;color:#777799;"></i> &nbsp;'+moons[curPhase].text);
          $('#nowcast-sunrise').html(isNaN(sun.sunrise) ? '' : '<span>'+moment(sun.sunrise).format('H:mm')+'</span>');
          $("#nowcast-sunset").html(isNaN(sun.sunset) ? '' : '<span>'+moment(sun.sunset).format('H:mm')+'</span>');
        }
    });
}

$(document).ready(function(){  
    getProfileValues();
    setInterval(getProfileValues, 360000);
});
