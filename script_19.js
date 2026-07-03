
$(document).ready(function(){
    var noData = false;
    var windLoaded = false;
    customWidth = window.innerWidth < 400 ? 300 : 400;
    var _cardinals = [
        "N","NNE","NE","ENE",
        "E","ESE","SE","SSE",
        "S","SSW","SW","WSW",
        "W","WNW","NW","NNW"
    ];
    var wd = new wdist('wdirdist', {size:customWidth, label:'%', calmText:'Calm', cardinals:_cardinals});
    wd.render();
    
    var ws = new wdist('wspddist', {size:customWidth, label:' m/s', cardinals:_cardinals});
    ws.render();
    
    function _wind(url) {
        $.ajax({
            data:{code:"2533437581",  WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
            dataType:"json",
            type: "GET",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) {
                var welevContainer = false;
                var wind02Container = false;
                
                //--
                setValues(data,'wspd');
                setValues(data,'wspdavg');
                setValues(data,'wspdhi');
                                //--
                if(data == null || data['wdir_current'] == null || data['wdir_current'][0] < data['last_update'] || data['wdir_current'][1] < -40){
                    $('#gauge-wdir').fadeTo( 1500, 0.3 );
                    gwdir.setValue(null);
                }else{
                    gwdir.setValue(data.wdir_current[1]);
                }
                
                if(data == null || data['wdiravg_current'] == null || data['wdiravg_current'][0] < data['last_update']  || data['wdiravg_current'][1] < -40){
                    $('#gauge-wdiravg').fadeTo( 1500, 0.3 );
                    gwdiravg.setValue(null);
                }else{
                    gwdiravg.setValue((Math.floor((data.wdiravg_current[1]+22.5/2)/22.5)%16)*22.5);
                }

                if(data == null || data['wspdavg_current'] == null || data['wdiravg_current'] == null || +moment()-lastUpdateTime > 172800000){
                    noData = true;
                    $('.wind-absolute').fadeIn(1500);
                }
                
                // Wind elevation
                if(data['welev_current'] || data['welevavg_current']){
                    $("#welev-gauges-container").css("display","");
                    welevContainer = true;
                }
                
                //--
                if(data == null || data['welev_current'] == null || data['welev_current'][0] < data['last_update'] || data['welev_current'][1] < -40){
                    $('#gauge-welev').fadeTo( 1500, 0.3 );
                    gwelev.setValue(null);
                }else{
                    gwelev.setValue(data.welev_current[1]);
                }
                
                if(data == null || data['welevavg_current'] == null || data['welevavg_current'][0] < data['last_update']  || data['welevavg_current'][1] < -40){
                    $('#gauge-welevavg').fadeTo( 1500, 0.3 );
                    gwelevavg.setValue(null);
                }else{
                    gwelevavg.setValue((Math.floor((data.welevavg_current[1]+22.5/2)/22.5)%16)*22.5);
                }
                
                
                // Wind 02
                if(data['wspd02_current'] || data['wspdavg02_current'] || data['wspdhi02_current'] || data['wdir02_current'] || data['wdiravg02_current']){
                    $("#wind02-gauges-container").css("display","");
                    wind02Container = true;
                }
                
                if(wind02Container){
                    //--
                    setValues(data,'wspd02');
                    setValues(data,'wspdavg02');
                    setValues(data,'wspdhi02');
                    
                    //--
                    if(data == null || data['wdir02_current'] == null || data['wdir02_current'][0] < data['last_update'] || data['wdir02_current'][1] < -40){
                        $('#gauge-wdir02').fadeTo( 1500, 0.3 );
                        gwdir02.setValue(null);
                    }else{
                        gwdir02.setValue(data.wdir02_current[1]);
                    }
                    
                    if(data == null || data['wdiravg02_current'] == null || data['wdiravg02_current'][0] < data['last_update']  || data['wdiravg02_current'][1] < -40){
                        $('#gauge-wdiravg02').fadeTo( 1500, 0.3 );
                        gwdiravg02.setValue(null);
                    }else{
                        gwdiravg02.setValue((Math.floor((data.wdiravg02_current[1]+22.5/2)/22.5)%16)*22.5);
                    }
                }
                
                if(!windLoaded && !noData)
                    _windSec(urlSector);
                
                //--
                windLoaded = true;
                NProgress.done();
            }
       });
    }    
    
    function _windSec(url) {
        $.ajax({
            data:{code:"2533437581"},
            dataType:"json",
            type: "GET",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) {
                var calm = 0;
                var wdirdistData = [];
                var wspddistData = [];

                if(data.date !=undefined){
                    if(data.date !=null){
                        var lastday = new moment.utc(data.date*1000);
                        $("#wdday").html(lastday.format('LL'));
                        $("#wsday").html(lastday.format('LL'));
                    }
                    
                    for (var i=0; i<data.values.length; i++){
                        var samples = data.values[i].scale.reduce(function(a, b) { return a + b; }, 0);
                        wdirdistData[i] = samples - data.values[i].scale[0];
                        wspddistData[i] = wdirdistData[i] > 0 ? data.values[i].sum / wdirdistData[i] : 0;
                        calm += data.values[i].scale[0];
                    }
                }
                
                if(wdirdistData.length > 0){
                    wd.setValues(wdirdistData, calm);
                }else{
                    $('#wdcontainer').fadeTo( 1500, 0.3 );
                }

                if(wspddistData.length > 0){
                    ws.setValues2(wspddistData);
                }else{
                    $('#wscontainer').fadeTo( 1500, 0.3 );
                }
            }
       });
    }
    wind = function(){
        urlSector = '/device/wind';
        urlValues = '/device/stats';
        urlUpdate = '/device/ajaxupdatedate';
        
        if(!windLoaded){
            _wind(urlValues);
        }
        
        var killId = setTimeout(function() {}, 100);
        for (var i = killId; i > 0; i--) clearInterval(i);
        
        setInterval(function(){
            if(lastUpdateTime != null) $('#device-view-last-update').html(lastUpdateTime.fromNow()); 
        }, 10000);
        
        setTimeout(function(){ 
            runFn(function(){
                updateDate(urlUpdate);
                _wind(urlValues);
            }, updateInterval*1000, (updateInterval - lastUpdateAgo)*1000 );
        }, 1000);
        
        setTimeout(function(){$('#ad-box-close').show();}, 2000);
    }
});
