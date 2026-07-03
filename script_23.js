    
var serverTime;
var updateInterval = 600;
var lastUpdateAgo;

var runFn = function(fn, interval, wait){
    setTimeout(function(){
        fn();
        setInterval(fn, interval);
    }, wait);
}
    

    var updateDate = function(url) {
        $.ajax({
            data:{d:"2533437581", WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
            dataType:"json",
            type: "POST",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) { 
                if(data.status == 0){
                    $('#last-update-text').html(data.update);
                }else{    
                    container = $('#device-view-last-update-container');  
                    container.css('color','#20A120');
                    $('#device-view-last-update-container > i').addClass('icon-refresh').addClass('icon-spin');
                    $('#last-update-text').html("Last updated");
                    lastUpdateAgo = data.update;
                    lastUpdateTime = new moment.utc().subtract(data.update, 'seconds');
                    $('#device-view-last-update').html(lastUpdateTime.fromNow());
                    
                    if (data.status != 2)
                        colors = ["#20A120","#339625","#468B2A","#59802F","#6C7534","#7F6A39","#925F3E","#A55443","#B94A48"];
                    else
                        colors = ["#20A120","#309E30","#409B40","#509850","#609560","#709270","#808F80","#888C88","#888888"];
                    
                    $.each(colors, function(index, color) {
                        setTimeout(function() {
                            $('#device-view-last-update-container').css("color", color);
                        }, 200 * index);
                    });
                    setTimeout(function() {
                        $('#device-view-last-update-container > i').removeClass('icon-spin');
                    }, 2000);
                    
                    serverTime = moment(data.server_time*1000);
                }
                NProgress.done(); 
            }
       });
    }
  
    var setValues = function (data, variable, zeros, units) {
        _zeros = 1;
        if(zeros != undefined)
            _zeros = zeros;

        if(data == null || data[variable+'_current'] == null || data[variable+'_current'][0] < data['last_update'] || data[variable+'_current'][1] <= -40){
            $('#gauge-'+variable).fadeTo( 1500, 0.3 );
            eval('g'+variable).setValue(null);
        } else {
            if(units != undefined){
                eval('g'+variable).config.units = units;
            }
            eval('g'+variable).config.valueFormat.dec = _zeros;
            eval('g'+variable).setValue(data[variable+'_current'][1]);
        }
      
        if(data[variable+'_day_min'] != undefined){
            $('#gauge-'+variable+'-max-day').html(data[variable+'_day_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-day').html(data[variable+'_day_min'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_min'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-max-month').html(data[variable+'_month_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-month').html(data[variable+'_month_min'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_min'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-max-year').html(data[variable+'_year_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-year').html(data[variable+'_year_min'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_min'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
        }
    }
    
    var setAccumValues = function (data, variable, zeros) {
        _zeros = 1;
        if(zeros != undefined)
            _zeros = zeros;
        
        if(data == null || data[variable+'_current'] == null || data[variable+'_current'][0] < data['last_update'] || data[variable+'_current'][1] <= -40){
            $('#gauge-'+variable).fadeTo( 1500, 0.3 );
            eval('g'+variable).setValue(null);
        } else {
            eval('g'+variable).setValue(data[variable+'_current'][1]);
        }
        
        if(data[variable+'_day_total'] != undefined){
            // $('#gauge-'+variable+'-max-day').html(data[variable+'_day_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_max'][0]*1000).utc().format('DD/MM/YYYY'));
            $('#gauge-'+variable+'-min-day').html(data[variable+'_day_total'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_total'][0]*1000).utc().format('DD/MM/YYYY'));
            $('#gauge-'+variable+'-max-month').html(data[variable+'_month_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_max'][0]*1000).utc().format('DD/MM/YYYY'));
            $('#gauge-'+variable+'-min-month').html(data[variable+'_month_total'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_total'][0]*1000).utc().format('MMMM YYYY'));
            $('#gauge-'+variable+'-max-year').html(data[variable+'_year_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_max'][0]*1000).utc().format('DD/MM/YYYY'));
            $('#gauge-'+variable+'-min-year').html(data[variable+'_year_total'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_total'][0]*1000).utc().format('YYYY'));
        }
    }    
    
    var setSolarValues = function (data, variable, zeros) {
        _zeros = 1;
        if(zeros != undefined)
            _zeros = zeros;
        
        if(data == null || data[variable+'_current'] == null || data[variable+'_current'][0] < data['last_update'] || data[variable+'_current'][1] <= -40){
            $('#gauge-'+variable).fadeTo( 1500, 0.3 );
            $('#gauge-'+variable).fadeTo( 1500, 0.3 );
            eval('g'+variable).setValue(null);
        } else {            
            eval('g'+variable).setValue(data[variable+'_current'][1]);
        }
        
        if(data[variable+'_day_hours']!=undefined){
            $('#gauge-'+variable+'-max-day').html(data[variable+'_day_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-day').html(data[variable+'_day_hours'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_day_hours'][0]*1000).utc().format('DD/MM/YYYY'));
            $('#gauge-'+variable+'-max-month').html(data[variable+'_month_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-month').html(data[variable+'_month_hours'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_month_hours'][0]*1000).utc().format('MMMM YYYY'));
            $('#gauge-'+variable+'-max-year').html(data[variable+'_year_max'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_max'][0]*1000).utc().format('DD/MM/YYYY '+'HH:mm'));
            $('#gauge-'+variable+'-min-year').html(data[variable+'_year_hours'][1].toFixed(_zeros)).attr('title', moment(data[variable+'_year_hours'][0]*1000).utc().format('YYYY'));
        }
}
    
    var _tabs = ['#profile', '#current', '#wind', '#evolution', '#inside', '#extra', '#aq', '#tracking', '#timelapse'];
    
    function loadTab (s){
        try{
            _str = s.substr(1)
            if(typeof window[_str] === 'function')
                window[_str]();
            window.location.hash = _str;
            document.body.scrollTop = 0; 
            document.documentElement.scrollTop = 0;
            setTimeout(function() {
                document.body.scrollTop = 0; 
                document.documentElement.scrollTop = 0;
            }, 5);
        }catch (err){
            console.log("Error: "+err.message);
        }
    }

    //---
    /**
    *
    */
    ajaxFavoriteFn = function (url, dev, del){
        jQuery.ajax({
            dataType:"json",
            type: "POST",
            data:{
                device:dev,
                delete:del,
                WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="
            },
            beforeSend:function(){
            },
            success:function(data){ 
                if(data.type=="delete"){
                    if(data.success){
                        setFlash("","You are no longer following the device <strong>FT0300</strong>.","success");
                        $("#favorite-star").removeClass("icon-star").addClass("icon-star-o");
                        $("#favorite-link").attr("title", "Follow FT0300").tooltip("fixTitle").tooltip("show");
                        $("#favorite-star").removeClass("favorited");
                    }else
                        setFlash("","<strong>Oops!</strong> An error occurred. Please, contact Support.","error");
                }else if(data.type=="add"){
                    if(data.success){
                        setFlash("","You are now following the device <strong>FT0300</strong>.","success");
                        $("#favorite-star").removeClass("icon-star-o").addClass("icon-star");
                        $("#favorite-link").attr("title", "Unfollow FT0300").tooltip("fixTitle").tooltip("show");                    
                        $("#favorite-star").addClass("favorited");
                    }else
                        setFlash("","<strong>Oops!</strong> An error occurred. Please, contact Support.","error");
                }
            },
            complete:function(){
                newFavoriteNumber();
            },
            error:function(){
                setFlash("","<strong>Oops!</strong> An error occurred. Please, contact Support.","error");
            },
            url:url,
            cache:false
        });
    };    
    

$(document).on('shown', 'a[data-toggle="pill"]', function (e) {
    var s = $(e.target).attr("href");
    loadTab(s);
    if (s && s.startsWith('#')) {
        window.location.hash = s;
    }
});
    
$(document).ready(function(){
    
    updateDate("/device/ajaxupdatedate");
    
    setInterval(function(){
        $('#device-view-last-update').html(lastUpdateTime.fromNow());  
    }, 10000);
    
    if (_tabs.indexOf(window.location.hash) != -1) {
        curTab = window.location.hash;
    }else{
        curTab = "#profile";
    }
    
    $('#device-tabs a[href="'+curTab+'"]').tab('show'); // Select tab by name
    loadTab(curTab);

    $('a[data-toggle="pill"]').on('shown', function (e) {
        s = $(e.target).attr("href");
        loadTab(s);

    })
    

    
    $("#favorite-star").click(function(event){
        event.preventDefault();
        if($(this).hasClass("favorited")){
            ajaxFavoriteFn("/device/ajaxfavorite","2533437581",1);    
        }
        else {
            ajaxFavoriteFn("/device/ajaxfavorite","2533437581",0);
        }
    });    
    
    $(".favorite-star").hover(
        function(event){
            if($(this).hasClass("favorited")){
                $(this).removeClass("icon-star").addClass("icon-star-o");
            }
            else {
                $(this).removeClass("icon-star-o").addClass("icon-star");
            }
        },        
        function(event){
            if($(this).hasClass("favorited")){
                $(this).removeClass("icon-star-o").addClass("icon-star");
            }
            else {
                $(this).removeClass("icon-star").addClass("icon-star-o");
            }
    });
    
    $(".launch_modal").click(function(event){
        _url = $(this).attr("href");
        if(_url != "#")
            $("#signin_button").attr("href", _url);
        else{
            $("#signin_button").attr("href", document.URL.replace(/\/d(?=\d{10})/,'/f'));
        }
    });
});
