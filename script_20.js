
var isDeviceCurrentUser = false;
var isMobile = false;
var cardinals = [
	"N","NNE","NE","ENE",
	"E","ESE","SE","SSE",
	"S","SSW","SW","WSW",
	"W","WNW","NW","NNW"
];
var cardinalsLite = [
	"N","NE",
	"E","SE",
	"S","SW",
	"W","NW",
	"N"
];
var currentPeriod = 'day';
var timezone = "America/Argentina/Buenos_Aires";
var minSamples = {'day': 1, 'week': 4, 'month': 12}

var evolutionBlock = false;

var dayName = ["0 day","0 days"];
var evolutionLoaded = false;
var plotDateFormat = {
    'day' : {'axis':'HH', 'tooltip':'ll '+'H:mm'},
    'week' : {'axis':'D', 'tooltip':'ll '+'H:mm'},
    'month' : {'axis':'D', 'tooltip':'ll'}
}

var units = {
    temp:'°C',
    bar:'hPa',
    wspd:'m/s',
    rain:'mm',
    rainrate:'mm/h',
    vis:'km',
    lum:'cd/m²'
};

var standardRows = function(data){
  var rows = [['ts','data1','data2','data3']];
  var cell;
  
  for(var date in data){
      cell = [+date, null, null, null];
      for(var variable in data[date]){
          if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
            
            if(data[date][variable]['stats']['min'] != null)
              cell[1] = (data[date][variable]['stats']['min']).toFixed(1);
              
            if(data[date][variable]['stats']['sum'] != null)
              cell[2] = (data[date][variable]['stats']['sum']/data[date][variable]['samples']).toFixed(1);
              
            if(data[date][variable]['stats']['max'] != null)
              cell[3] = (data[date][variable]['stats']['max']).toFixed(1);
              
          }
      }
      rows.push(cell);
  }
  return rows;
}

var variables = {
    temp:{
        id:101, 
        chart:{}, 
        unit: {data1: ' '+units.temp , data2: ' '+units.temp, data3: ' '+units.temp},
        range:{ min: null, max: null },
        padding:{top: 5, bottom: 5},
        colors:{ data1: '#D97171', data2: '#BB0000', data3: '#8C0000'},
        types:{ data1: 'spline', data2: 'spline', data3: 'spline'},
        names:{ data1:"Min", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:1,
        yformat:'.1f',
        order:'desc',
        stats:function(data){
          var variable = 101;
          var show = false;
          
          if(data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(1)+' '+units.temp);
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(1)+' '+units.temp);
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1)+' '+units.temp);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#temp_graph_container').css('display','');
          }
        },
        rows:standardRows,
        value:function(val){return ''},
        y2:{show:false}
    },
    hum:{
        id:201, 
        chart:{},
        unit: {data1: ' %' , data2: ' %', data3: ' %'},
        range:{ min:0, max:100 },
        padding:{top: 5, bottom: 5},
        colors:{ data1: '#85C9DD', data2: '#49AFCD', data3: '#368399'},
        types:{ data1: 'spline', data2:'spline', data3: 'spline'},
        names:{ data1:"Min", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:0,
        yformat:'.0f',
        order:'desc',
        stats:function(data){
          var variable = 201;
          var show = false;
          
          if(data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(0)+' %');
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(0)+' %');
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(0)+' %');
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#hum_graph_container').css('display','');
          }
        },
        rows:standardRows,
        value:function(val){return ''},
        y2:{show:false}
    },
    bar:{
        id:701, 
        chart:{},
        unit: {data1: ' '+units.bar , data2: ' '+units.bar, data3: ' '+units.bar},
        range:{ min:null, max:null },
        padding:{top: 20, bottom: 20},
        colors:{ data1: '#A4A4BB', data2: '#777799', data3: '#595972'},
        types:{ data1: 'spline', data2:'spline', data3: 'spline'},
        names:{ data1:"Min", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:g_zeros.bar,
        yformat:'.'+g_zeros.bar+'f',
        order:'desc',
        stats:function(data){
          var variable = 701;
          var show = false;
          
          if(data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(g_zeros.bar)+' '+units.bar);
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(g_zeros.bar)+' '+units.bar);
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(g_zeros.bar)+' '+units.bar);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#bar_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1','data2','data3']];
          var cell;
          
          for(var date in data){
              cell = [+date, null, null, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    
                    if(data[date][variable]['stats']['min'] != null)
                      cell[1] = (data[date][variable]['stats']['min']).toFixed(g_zeros.bar);
                      
                    if(data[date][variable]['stats']['sum'] != null)
                      cell[2] = (data[date][variable]['stats']['sum']/data[date][variable]['samples']).toFixed(g_zeros.bar);
                      
                    if(data[date][variable]['stats']['max'] != null)
                      cell[3] = (data[date][variable]['stats']['max']).toFixed(g_zeros.bar);
                      
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    wspd:{
        id:541, 
        chart:{},
        unit: {data1: ' '+units.wspd , data2: ' '+units.wspd, data3: ' '+units.wspd, data4: ' '+units.wspd},
        range:{ min:0, max:null },
        padding:{top: 10, bottom: 5},
        colors:{ data1: '#55AFD1', data2: '#0088BB', data3: '#00668C', data4: '#00445D'},
        types:{ data1: 'spline', data2:'spline', data3: 'spline', data4: 'spline'}, 
        names:{ data1:"Min", data2:"Avg", data3:"Max", data4:"Gust"},
        axes:{},
        zeros:1,
        yformat:'.1f',
        order:'desc',
        stats:function(data){
          var variable = 541;
          var show = false;
          
          if(data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(1)+' '+units.wspd);
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(1)+' '+units.wspd);
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1)+' '+units.wspd);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(data[521]['max'] != null){
              $('#stats-521-max').html((data[521]['max']).toFixed(1)+' '+units.wspd);
              $('#label-521-max').css('display','');
              show = true;
          }else{
            $('#stats-521-max').html(' -');
          }
          if(show){
            $('#wspd_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1','data2','data3','data4']];
          var cell;
          
          for(var date in data){
              cell = [+date, null, null, null, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    
                    if(data[date][variable]['stats']['min'] != null)
                      cell[1] = (data[date][variable]['stats']['min']).toFixed(1);
                      
                    if(data[date][variable]['stats']['sum'] != null)
                      cell[2] = (data[date][variable]['stats']['sum']/data[date][variable]['samples']).toFixed(1);
                      
                    if(data[date][variable]['stats']['max'] != null)
                      cell[3] = (data[date][variable]['stats']['max']).toFixed(1);  
        
                    if(data[date][521]['stats'] != null && data[date][521]['stats']['max'] != null)
                      cell[4] = (data[date][521]['stats']['max']).toFixed(1);
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    wdir:{
        id:641, 
        chart:{},
        point: { show: true, r: 3, focus: { expand: { r: 6 }}},
        unit: {data1: '°'},
        range:{ min:0, max:360 },
        padding:{top: 10, bottom: 5},
        colors:{ data1: '#0088BB'},
        types:{ data1: 'spline'}, 
        names:{ data1:"Avg"},
        axes:{},
        tickvalues:[0, 45, 90, 135, 180, 225, 270, 315, 360],
        zeros:0,
        yformat:'.0f',
        order:'desc',
        stats:function(data){
          var variable = 641;
          var show = false;
        
        if(data[variable]['sum'] != null){
          var value = degrees(data[variable]['sum']['x'], data[variable]['sum']['y']);
            $('#stats-'+variable+'-mean').html(value+'° ('+cardinals[Math.floor((+value+(360/16/2))/(360/16))%16]+')');
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(show){
            $('#wdir_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1']];
          var cell;
          
          for(var date in data){
              cell = [+date, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    
                    if(data[date][variable]['stats']['sum'] != null)
                      cell[1] = degrees(data[date][variable]['stats']['sum']['x'], data[date][variable]['stats']['sum']['y']);
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ' ('+cardinals[Math.floor((+val+(360/16/2))/(360/16))%16]+')'},
        y2:{
            show: true,
            default: [-0.2,8.4],
            tick: {
                values: [0,1,2,3,4,5,6,7,8],
                format: function (d) { 
                    return cardinalsLite[d]; 
                }
            }
        },
        y2padding: true,
    },
    rain:{
        id:801, 
        chart:{},
        unit: {data1: ' '+units.rain, data2: ' '+units.rainrate},
        range:{ min:0, max:null },
        padding:{top: 10, bottom: 0},
        colors:{ data1: '#49AFCD', data2: '#368399'},
        types:{ data1: 'bar', data2: 'dot'},
        names:{ data1:"Total", data2:"Max"},
        axes:{data2: 'y2'},
        zeros:g_zeros.rain,
        yformat:'.'+g_zeros.rain+'f',
        hide:['data2'],
        order:null,
        stats:function(data){
          var variable = 801;
          var show = false;
          
          if(data[variable]['drought'] != null){
              var drought = (data[variable]['drought']/24/6).toFixed(0);
              var droughtString;

              if(drought == 1)
                droughtString = dayName[0].replace("0",drought);
              else if(drought > 30)
                droughtString = dayName[1].replace("0",'>30');
              else
                droughtString = dayName[1].replace("0",drought);

              $('#stats-'+variable+'-drought').html(droughtString);
              
              show = true;
          }else{
            $('#stats-'+variable+'-drought').html(' -');
          }
          if(data[variable]['total'] != null){
            $('#stats-'+variable+'-total').html((data[variable]['total']).toFixed(g_zeros.rain)+' '+units.rain);
            show = true;
          }else{
            $('#stats-'+variable+'-total').html(' -');
          }
          if(data[variable]['max'] != null && data[variable].max.value != null){
            $('#stats-'+variable+'-max').html((data[variable].max.value).toFixed(g_zeros.rain)+' '+units.rain);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#rain_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1','data2']];
          var cell;
          var variable = 801;
          var variable2 = 901;
          
          for(var date in data){
              cell = [+date, null, null];

              if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                if(data[date][variable]['stats']['total'] != null)
                  cell[1] = (data[date][variable]['stats']['total']).toFixed(g_zeros.rain);  

                if(data[date][variable2]['stats']!= null && data[date][variable2]['stats']['max'] != null)
                  cell[2] = (data[date][variable2]['stats']['max']).toFixed(g_zeros.rain);
              }

              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    solarrad:{
        id:1001, 
        chart:{},
        unit: {data1: ' W/m²' , data2: ' W/m²', data3: ' W/m²', data4: ' h'},
        range:{ min:0, max:null },
        padding:{top: 10, bottom: 0},
        colors:{ data1: '#DF8B66', data2: '#D0511A', data3: '#9C3C13', data4: '#FFD331'},
        types:{ data1: 'spline', data2:'spline', data3: 'spline', data4: 'bar'},
        names:{ data1:"Avg (24 h)", data2:"Avg", data3:"Max", data4:"Hours"},
        axes:{data4: 'y2'},
        zeros:0,
        yformat:'.0f',
        order:'desc',
        stats:function(data){
          var variable = 1001;
          var show = false;
          
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean24').html((data[variable]['sum']/data[variable]['samples']).toFixed(1)+' W/m²');
            show = true;
          }else
            $('#stats-'+variable+'-mean24').html(' -');
        
          if(data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['partial']).toFixed(1)+' W/m²');
            show = true;
          }else
            $('#stats-'+variable+'-mean').html(' -');
        
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1)+' W/m²');
            show = true;
          }else
            $('#stats-'+variable+'-max').html(' -');
        
          if(data[variable]['hours'] != null){
            $('#stats-'+variable+'-hours').html((data[variable]['hours']).toFixed(1)+' h');
            show = true;
          }else
            $('#stats-'+variable+'-hours').html(' -');
        
          if(show){
            $('#solarrad_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1','data2','data3','data4']];
          var cell;
          
          for(var date in data){
              cell = [+date, null, null, null, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    
                      if(data[date][variable]['stats']['sum'] != null)
                        cell[1] = (data[date][variable]['stats']['sum']/data[date][variable]['samples']).toFixed(1);

                      if(data[date][variable]['stats']['sum'] != null && data[date][variable]['stats']['partial'] > 0)
                        cell[2] = (data[date][variable]['stats']['sum']/data[date][variable]['stats']['partial']).toFixed(1);

                      if(data[date][variable]['stats']['max'] != null)
                        cell[3] = (data[date][variable]['stats']['max']).toFixed(1);

                      if(data[date][variable]['stats']['hours'] != null)
                        cell[4] = (data[date][variable]['stats']['hours']).toFixed(1);
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    uvi:{
        id:1101, 
        chart:{},
        unit: {data1: '' , data2: '', data3: ''},
        range:{ min:0, max:16 },
        padding:{top: 10, bottom: 0},
        colors:{ data1: '#9C85DA', data2: '#6B49C8', data3: '#503696'},
        types:{ data1: 'spline', data2:'spline', data3: 'spline'},
        names:{ data1:"Avg (24 h)", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:0,
        yformat:'.0f',
        order:'desc',
        stats:function(data){
          var variable = 1101;
          $('#stats-'+variable+'-mean24').html((data[variable]['sum']/data[variable]['samples']).toFixed(1));
          $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['partial']).toFixed(1));
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1));
            $('#uvi_graph_container').css('display','');
          }else
            $('#stats-'+variable+'-max').html(' -');
        },
        rows:function(data){
          var rows = [['ts','data1','data2','data3']];
          var cell;
          
          for(var date in data){
              cell = [+date, null, null, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    
                    if(data[date][variable]['stats']['sum'] != null)
                      cell[1] = (data[date][variable]['stats']['sum']/data[date][variable]['samples']).toFixed(1);
                    
                    if(data[date][variable]['stats']['sum'] != null && data[date][variable]['stats']['partial'] != 0)
                      cell[2] = (data[date][variable]['stats']['sum']/data[date][variable]['stats']['partial']).toFixed(1);
                    
                    if(data[date][variable]['stats']['max'] != null)
                      cell[3] = (data[date][variable]['stats']['max']).toFixed(1);
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    et:{
        id:811, 
        chart:{},
        unit: {data1: ' '+units.rain},
        range:{ min:0, max:null },
        padding:{top: 10, bottom: 0},
        colors:{ data1: '#49AFCD'},
        types:{ data1: 'bar'},
        names:{ data1:"Total"},
        axes:{},
        zeros:g_zeros.rain,
        yformat:'.'+g_zeros.rain+'f',
        order:'desc',
        stats:function(data){
          var variable = 811;
          var show = false;
          if(data[variable]['total'] != null){
            $('#stats-'+variable+'-total').html((data[variable]['total']).toFixed(g_zeros.rain)+' '+units.rain);
            show = true;
          }else
            $('#stats-'+variable+'-total').html(' -');
        
          if(data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable].max.value).toFixed(g_zeros.rain)+' '+units.rain);
            show = true;
          }else
            $('#stats-'+variable+'-max').html(' -');
        
          if(show){
            $('#et_graph_container').css('display','');
          }
        },
        rows:function(data){
          var rows = [['ts','data1']];
          var cell;
          
          for(var date in data){
              cell = [+date, null];
              for(var variable in data[date]){
                  if(data[date][variable]['samples'] != null && data[date][variable]['samples'] > minSamples[currentPeriod]){
                    if(data[date][variable]['stats']['total'] != null)
                      cell[1] = (data[date][variable]['stats']['total']).toFixed(g_zeros.rain);
                  }
              }
              rows.push(cell);
          }
          return rows;
        },
        value:function(val){return ''},
        y2:{show:false}
    },
    vis:{
        id:6001, 
        chart:{}, 
        unit: {data1: ' '+units.vis , data2: ' '+units.vis, data3: ' '+units.vis},
        range:{ min: null, max: null },
        padding:{top: 5, bottom: 5},
        colors:{ data1: '#00668C', data2: '#0088BB', data3: '#55AFD1'},
        types:{ data1: 'spline', data2: 'spline', data3: 'spline'},
        names:{ data1:"Min", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:1,
        yformat:'.1f',
        order:'desc',
        stats:function(data){
          var variable = 6001;
          var show = false;
          
          if(data[variable] != null && data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(1)+' '+units.vis);
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable] != null && data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(1)+' '+units.vis);
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable] != null && data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1)+' '+units.vis);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#vis_graph_container').css('display','');
          }
        },
        rows:standardRows,
        value:function(val){return ''},
        y2:{show:false}
    },
    lum:{
        id:6501, 
        chart:{}, 
        unit: {data1: ' '+units.lum , data2: ' '+units.lum, data3: ' '+units.lum},
        range:{ min: null, max: null },
        padding:{top: 5, bottom: 5},
        colors:{ data1: '#DA7526', data2: '#E39A32', data3: '#EDBE3E'},
        types:{ data1: 'spline', data2: 'spline', data3: 'spline'},
        names:{ data1:"Min", data2:"Avg", data3:"Max"},
        axes:{},
        zeros:1,
        yformat:'.2s',
        order:'desc',
        stats:function(data){
          var variable = 6501;
          var show = false;
          
          if(data[variable] != null && data[variable]['min'] != null){
            $('#stats-'+variable+'-min').html((data[variable]['min']).toFixed(1)+' '+units.lum);
            show = true;
          }else{
            $('#stats-'+variable+'-min').html(' -');
          }
          if(data[variable] != null && data[variable]['sum'] != null){
            $('#stats-'+variable+'-mean').html((data[variable]['sum']/data[variable]['samples']).toFixed(1)+' '+units.lum);
            show = true;
          }else{
            $('#stats-'+variable+'-mean').html(' -');
          }
          if(data[variable] != null && data[variable]['max'] != null){
            $('#stats-'+variable+'-max').html((data[variable]['max']).toFixed(1)+' '+units.lum);
            show = true;
          }else{
            $('#stats-'+variable+'-max').html(' -');
          }
          if(show){
            $('#lum_graph_container').css('display','');
          }
        },
        rows:standardRows,
        value:function(val){return ''},
        y2:{show:false}
    },
  };

var _loader = 0;

var getEvolution = function(period){
  NProgress.start();
  for(var variable in variables){
    (function(currentVar){
    $.ajax({	
      data:{device:"2533437581", variable:currentVar.id, period:period, WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
      dataType:'json',
      type: 'POST',
      url: '/device/evolution',
      beforeSend: function(){
          $('#ev'+currentVar.id).next().css('display','block');
          currentVar.chart.flush();
          currentVar.chart.load({unload: true});
      },
      success:function (data) {
          try{
            setTimeout(function(){
                currentVar.stats(data.data.summary);
                currentVar.chart.load({unload: true, rows: currentVar.rows(data.data.values)});
                _loader++;
                if(_loader > 5){
                  NProgress.done();
                  evolutionBlock = false;
                  evolutionLoaded = true;
                }
            },500);
          }catch(err){}
          setTimeout(function(){$('#ev'+currentVar.id).next().hide();},500);
      }
    });})(variables[variable]);
  }
};

var chart = function (variable) {
  var hide = variable.hide || [];

  return c3.generate({
      bindto: '#ev'+variable.id,
      transition: {duration: 0},
      spline:{
        interpolation: {
          type: 'monotone'
        },
      },
      size: { height: 260 },
      padding: { top:10, left:46, right:(variable.y2padding != null ? 30 : 0) },
      point: variable.point != null ? variable.point : { show: true, r: 1, focus: { expand: { r: 4 }}},
      grid: { 
        y: { show: true },
      },
      data: {
          types: variable.types,
          x: 'ts',
          rows: [],
          axes: variable.axes,
          colors: variable.colors,
          names: variable.names,
      },
      axis: { 
        x: { type: 'timeseries', tick: { culling: false, format: function (e,d){
                var currentDate = moment.utc(e*1000).tz(timezone);
                
                if(currentPeriod == 'month' && isMobile && (currentDate.date() % 2 != 1 || currentDate.date() == 31))
                    return '';
                
                if(currentPeriod == 'week' && currentDate.hour() != 0)
                    return '';
                
                if(currentPeriod == 'day' && isMobile && currentDate.hour() % 2 != 0)
                    return '';

                return currentDate.format(plotDateFormat[currentPeriod]['axis']);
            }}
        },
        y: { 
          min:variable.range.min, 
          max:variable.range.max, 
          padding: variable.padding, 
          tick: {
            values: variable.tickvalues ? variable.tickvalues : null, 
            format: d3.format(variable.yformat)
            } 
        },
        y2: variable.y2,
      },
      tooltip: {
        order: variable.order,
        format: {
          title: function (e) {
              return moment.utc(e*1000).tz(timezone).format(plotDateFormat[currentPeriod]['tooltip']);
          },
          value: function (e, ratio, id, index) {return e+variable.unit[id]+variable.value(e)}
        }
      },
      legend: {
        position: 'bottom',
        hide:hide
      }
  });
};

$('#plot-date-btn-day').on('click', function(e){
  if(!evolutionBlock){
    
    evolutionBlock = true;
    $('.date-btn').each(function(e){$(this).removeClass("active");});
    currentPeriod = 'day';
    getEvolution('day');
    $(this).addClass("active");
    
  }

});

$('#plot-date-btn-week').on('click', function(e){
  if(!evolutionBlock){
    
    evolutionBlock = true;
    $('.date-btn').each(function(e){$(this).removeClass("active");});

    currentPeriod = 'week';
    getEvolution('week');
    $(this).addClass("active");
    
  }

});

$('#plot-date-btn-month').on('click', function(e){
  if(!evolutionBlock){
    evolutionBlock = true;
    $('.date-btn').each(function(e){$(this).removeClass("active");});

    currentPeriod = 'month';
    getEvolution('month');
    $(this).addClass("active");

  }

});

$('document').ready(function(){
  for(variable in variables){
    variables[variable].chart = chart(variables[variable]);
  }
	evolution = function (){
    if(!evolutionLoaded){
      getEvolution('day');
    }
  }
});
