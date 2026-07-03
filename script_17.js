
$(document).ready(function(){    
    var _uvi_levels = function (value) {
        value = Math.floor(value);
        if (value==0)
            return false;
        else if (value<3)
            return "Low";
        else if (value<6)
            return "Moderate";
        else if (value<8)
            return "High";
        else if (value<11)
            return "Very high";
        else if (value<=16)
            return "Extreme";
        return false;
    }
    
    $("#solar-gauges-separator").css("display","none");
    $("#solar-gauges-container").css("display","none");
    
    var currentLoaded = false;
    
    function _current(url) {
        $.ajax({
            data:{code:"2533437581", WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
            dataType:"json",
            type: "GET",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) {
                if(data['solarrad_current'] || data['et_current'] || data['uvi_current'] ){
                    $("#solar-gauges-separator").css("display","");
                    $("#solar-gauges-container").css("display","");
                }
                //--            
                setValues(data,'temp');
                setValues(data,'hum',0);
                setValues(data,'bar', 1);
                //--
                setValues(data,'chill');
                setValues(data,'dew');
                setValues(data,'heat');
                //-
                setAccumValues(data,'rain', 1);
                setValues(data,'rainrate', 1);        
                //--
                setSolarValues(data,'solarrad');
                setAccumValues(data,'et');    
        
                if(data['uvi_current'] != null)
                  setValues(data,'uvi',1,_uvi_levels(data['uvi_current'][1]));
                else
                  setValues(data,'uvi');
                //--
                currentLoaded = true;
                NProgress.done();
            }
       });
    }
    
    current = function(){        
        urlValues = '/device/stats';
        urlUpdate = '/device/ajaxupdatedate';
        
        if(!currentLoaded){
            _current(urlValues);
        }
        
        var killId = setTimeout(function() {}, 100);
        for (var i = killId; i > 0; i--) clearInterval(i);
        
        setInterval(function(){
            if(lastUpdateTime != null) $('#device-view-last-update').html(lastUpdateTime.fromNow()); 
        }, 10000);
        
        setTimeout(function(){ 
            runFn(function(){
                updateDate(urlUpdate);
                _current(urlValues);
            }, updateInterval*1000, (updateInterval - lastUpdateAgo)*1000 );
        }, 1000);
        
        setTimeout(function(){$('#ad-box-close').show();}, 2000);
    }
});
