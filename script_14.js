
var imageError = function(e){
    e.onerror=null;
    e.src = 'https://app.weathercloud.net/images/icons/webcam.png';
    return true;
}
function ucfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
$(document).ready(function(){
    var timeDiff = -10800 + 1782139346 - (new Date).getTime()/1000;
    $('#header-localtime-container').html(ucfirst(moment.utc().add(timeDiff, 'seconds').format('H:mm')));
    $('#profile-localtime-container').html(ucfirst(moment.utc().add(timeDiff, 'seconds').format('MMMM D, H:mm')));
    setTimeout(function(){
        $('#header-localtime-container').html(ucfirst(moment.utc().add(timeDiff, 'seconds').format('H:mm')));
        $('#profile-localtime-container').html(ucfirst(moment.utc().add(timeDiff, 'seconds').format('MMMM D, H:mm')));
    }, 1000);


  

    // Leaflet map
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // OpenStreetMap attribution
    var attribution = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    // CC-BY-SA license
    // attribution += ', <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
    
    var latitude = -39.2800619;
    var longitude = -65.6597449;
    
    var mapOptions = {
        center : [latitude,longitude], 
        zoom : 12,
        zoomControl : false,
        scrollWheelZoom : false,
        doubleClickZoom : false,
    };
    
    var map = L.map('location-map', mapOptions);
    // Don't show the 'Leaflet' text.
    map.attributionControl.setPrefix('');
    map.dragging.disable();
    
    L.tileLayer(osmUrl, {maxZoom: 12, minZoom: 12, attribution: attribution}).addTo(map);
    
    var icon = L.icon({
        iconUrl: '/images/map/markers/marker-weathercloud-blue.svg',

        iconSize:     [37, 58], // size of the icon
        iconAnchor:   [18.5, 58], // point of the icon which will correspond to marker's location
    });
    
    var marker = L.marker([latitude,longitude], {icon: icon, clickable : false})
        .on('click', function (e) {window.location = '/map#2533437581';})
        .addTo(map);
    
    // -- //
    
    var mapInit=false;
    
    function initialize() {            
       setTimeout(function(){map.invalidateSize(false);},50);
       mapInit=true;
    }
    
    var profileLoaded = false;
    
    function _profile(url) {
        $.ajax({
            data:{d:"2533437581", WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
            dataType:"json",
            type: "POST",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) {
                if(data.observer.name != " ")
                    $("#profile-observer-name").html(data.observer.name+" | ");
                href = "https://app.weathercloud.net/device/@";
                $("#profile-observer-nickname").html(data.observer.nickname).attr("href","@"+data.observer.nickname);
                $("#profile-observer-company").html(data.observer.company);
                $("#profile-followers-number").html(data.followers.number);
                $("#profile-device-brand").html(data.device.brand);
                $("#profile-device-model").html(data.device.model);
                                    $("#profile-followers-number").attr("data-target","#register-modal");
                                
                profileLoaded = true;
                NProgress.done();
            },
            error:function () {
                $("#profile-observer-nickname").html("");
                $("#profile-observer-company").html("");
                $("#profile-followers-number").html("");
                $("#profile-device-brand").html("");
                $("#profile-device-model").html("");
                profileLoaded = false;
                NProgress.done();
            }
       });
    }

    function _newFavoriteNumber(url) {
        $.ajax({
            data:{d:"2533437581", WEATHERCLOUD_CSRF_TOKEN:"QmF0R09DdmxPbDFla2xKeU44dldnVzE5UGF4MDR3Q2Zl4rNIZ8-U14Owz6w3ZRy4BszfIk26onkEZFlrS1GnzQ=="},
            dataType:"json",
            type: "POST",
            url: url,
            beforeSend: function(){
                NProgress.start();
            },
            success:function (data) {
                $("#profile-followers-number").html(data);
                NProgress.done();
            },
            error:function () {
                NProgress.done();
            }
       });
    }
        
    newFavoriteNumber = function(){
        _newFavoriteNumber('/device/ajaxfavoritesnumber');
    }
    
    profile = function(){
        if(!profileLoaded){
            _profile('/device/ajaxprofile');
                        initialize();
                    }
    }
  
  updateWebcam = function(interval){
      $('.tab-webcam-img').each(function(e){
          var webcamImage = $(this)[0];

          if(webcamImage == null)
              return false;
            
          var imageSource = webcamImage.src.split('?')[0];
          
          if(webcamImage.src.indexOf('.jpg') > -1){
              var setInvervalId = setInterval(function() {
                  webcamImage.src = imageSource + '?' + (new Date).getTime();
              }, interval);
          }
      });
  }
  
  updateWebcam(3000);
});
