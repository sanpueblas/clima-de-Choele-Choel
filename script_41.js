
/*<![CDATA[*/
jQuery('#favorites_modal').modal({'backdrop':true,'keyboard':true,'show':false});

			//Init gauge
			var gtemp= new Thermometer
			(
				'temp',
				{"units":" \u00b0C","id":"temp","minValue":-40,"maxValue":60,"majorTicks":["-40","-20","0","20","40","60"],"highlights":[{"from":-40,"to":-20,"color":"#49AFCD"},{"from":-20,"to":0,"color":"#7FC3DD"},{"from":0,"to":20,"color":"#D3B9BE"},{"from":20,"to":40,"color":"#DA7777"},{"from":40,"to":60,"color":"#C83333"}]}
			);
			
			gtemp.draw();
		  

			//Init gauge
			var ghum= new RadialGauge
			(
				'hum',
				{"units":"%","id":"hum","valueFormat":{"int":1,"dec":0},"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"majorTicks":["0","20","40","60","80","100"],"highlights":[{"from":0,"to":20,"color":"#DBEFF5"},{"from":20,"to":40,"color":"#B6DFEB"},{"from":40,"to":60,"color":"#92CFE1"},{"from":60,"to":80,"color":"#6DBFD7"},{"from":80,"to":100,"color":"#49AFCD"}]}
			);
			
			ghum.draw();
		  

			//Init gauge
			var gbar= new RadialGauge
			(
				'bar',
				{"units":" hPa","id":"bar","minValue":950,"maxValue":1050,"majorTicks":["950","970","990","1010","1030","1050"],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":950,"to":970,"color":"#E4E4EB"},{"from":970,"to":990,"color":"#C9C9D6"},{"from":990,"to":1010,"color":"#ADADC2"},{"from":1010,"to":1030,"color":"#9292AD"},{"from":1030,"to":1050,"color":"#777799"}]}
			);
			
			gbar.draw();
		  

			//Init gauge
			var gdew= new Thermometer
			(
				'dew',
				{"units":" \u00b0C","id":"dew","minValue":-40,"maxValue":60,"majorTicks":["-40","-20","0","20","40","60"],"highlights":[{"from":-40,"to":-20,"color":"#49AFCD"},{"from":-20,"to":0,"color":"#7FC3DD"},{"from":0,"to":20,"color":"#D3B9BE"},{"from":20,"to":40,"color":"#DA7777"},{"from":40,"to":60,"color":"#C83333"}]}
			);
			
			gdew.draw();
		  

			//Init gauge
			var gchill= new Thermometer
			(
				'chill',
				{"units":" \u00b0C","id":"chill","minValue":-40,"maxValue":60,"majorTicks":["-40","-20","0","20","40","60"],"highlights":[{"from":-40,"to":-20,"color":"#49AFCD"},{"from":-20,"to":0,"color":"#7FC3DD"},{"from":0,"to":20,"color":"#D3B9BE"},{"from":20,"to":40,"color":"#DA7777"},{"from":40,"to":60,"color":"#C83333"}]}
			);
			
			gchill.draw();
		  

			//Init gauge
			var gheat= new Thermometer
			(
				'heat',
				{"units":" \u00b0C","id":"heat","minValue":-40,"maxValue":60,"majorTicks":["-40","-20","0","20","40","60"],"highlights":[{"from":-40,"to":-20,"color":"#49AFCD"},{"from":-20,"to":0,"color":"#7FC3DD"},{"from":0,"to":20,"color":"#D3B9BE"},{"from":20,"to":40,"color":"#DA7777"},{"from":40,"to":60,"color":"#C83333"}]}
			);
			
			gheat.draw();
		  

			//Init gauge
			var grain= new RainGauge
			(
				'rain',
				{"units":" mm","id":"rain","minValue":0,"maxValue":100,"majorTicks":["0","20","40","60","80","100"],"highlights":[{"from":0,"to":20,"color":"#DBEFF5"},{"from":20,"to":40,"color":"#B6DFEB"},{"from":40,"to":60,"color":"#92CFE1"},{"from":60,"to":80,"color":"#6DBFD7"},{"from":80,"to":100,"color":"#49AFCD"}]}
			);
			
			grain.draw();
		  

			//Init gauge
			var grainrate= new RadialGauge
			(
				'rainrate',
				{"units":" mm\/h","id":"rainrate","minValue":0,"maxValue":50,"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"majorTicks":["0","10","20","30","40","50"],"highlights":[{"from":0,"to":10,"color":"#DBEFF5"},{"from":10,"to":20,"color":"#B6DFEB"},{"from":20,"to":30,"color":"#92CFE1"},{"from":30,"to":40,"color":"#6DBFD7"},{"from":40,"to":50,"color":"#49AFCD"}]}
			);
			
			grainrate.draw();
		  

			//Init gauge
			var gsolarrad= new RadialGauge
			(
				'solarrad',
				{"width":210,"height":210,"units":" W\/m\u00b2","id":"solarrad","minValue":0,"maxValue":1500,"majorTicks":["0","300","600","900","1200","1500"],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":300,"color":"#F7E34A"},{"from":300,"to":600,"color":"#EDBE3E"},{"from":600,"to":900,"color":"#E39A32"},{"from":900,"to":1200,"color":"#DA7526"},{"from":1200,"to":1500,"color":"#D0511A"}]}
			);
			
			gsolarrad.draw();
		  

			//Init gauge
			var get= new RainGauge
			(
				'et',
				{"width":210,"height":210,"units":" mm","id":"et","minValue":0,"maxValue":10,"majorTicks":["0","2","4","6","8","10"],"highlights":[{"from":0,"to":2,"color":"#DBEFF5"},{"from":2,"to":4,"color":"#B6DFEB"},{"from":4,"to":6,"color":"#92CFE1"},{"from":6,"to":8,"color":"#6DBFD7"},{"from":8,"to":10,"color":"#49AFCD"}]}
			);
			
			get.draw();
		  

			//Init gauge
			var guvi= new RadialGauge
			(
				'uvi',
				{"width":210,"height":210,"units":" ","id":"uvi","minValue":0,"maxValue":12,"majorTicks":["","","","3","","","6","","8","","","11+",""],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":1,"color":"#20A120"},{"from":1,"to":2,"color":"#67B715"},{"from":2,"to":3,"color":"#AFCD0A"},{"from":3,"to":4,"color":"#F7E400"},{"from":4,"to":5,"color":"#F9BA0D"},{"from":5,"to":6,"color":"#FB911A"},{"from":6,"to":7,"color":"#FD6828"},{"from":7,"to":8,"color":"#DC3414"},{"from":8,"to":9,"color":"#BB0000"},{"from":9,"to":10,"color":"#A01842"},{"from":10,"to":11,"color":"#853085"},{"from":11,"to":12,"color":"#6B49C8"}]}
			);
			
			guvi.draw();
		  

			//Init gauge
			var gwspd= new RadialGauge
			(
				'wspd',
				{"units":" m\/s","id":"wspd","minValue":0,"maxValue":50,"majorTicks":["0","10","20","30","40","50"],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":10,"color":"#D6ECF4"},{"from":10,"to":20,"color":"#ADD9E9"},{"from":20,"to":30,"color":"#85C6DF"},{"from":30,"to":40,"color":"#5CB3D4"},{"from":40,"to":50,"color":"#33A0C9"}]}
			);
			
			gwspd.draw();
		  

			//Init gauge
			var gwspdavg= new RadialGauge
			(
				'wspdavg',
				{"units":" m\/s","id":"wspdavg","minValue":0,"maxValue":50,"majorTicks":["0","10","20","30","40","50"],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":10,"color":"#D6ECF4"},{"from":10,"to":20,"color":"#ADD9E9"},{"from":20,"to":30,"color":"#85C6DF"},{"from":30,"to":40,"color":"#5CB3D4"},{"from":40,"to":50,"color":"#33A0C9"}]}
			);
			
			gwspdavg.draw();
		  

			//Init gauge
			var gwspdhi= new RadialGauge
			(
				'wspdhi',
				{"units":" m\/s","id":"wspdhi","minValue":0,"maxValue":50,"majorTicks":["0","10","20","30","40","50"],"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":10,"color":"#D6ECF4"},{"from":10,"to":20,"color":"#ADD9E9"},{"from":20,"to":30,"color":"#85C6DF"},{"from":30,"to":40,"color":"#5CB3D4"},{"from":40,"to":50,"color":"#33A0C9"}]}
			);
			
			gwspdhi.draw();
		  

			//Init gauge
			var gwdir= new RadialGauge
			(
				'wdir',
				{"majorTicks":["N","NE","E","SE","S","SW","W","NW"],"id":"wdir","dirGauge":true,"minValue":0,"maxValue":360,"minorTicks":0,"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":45,"color":"#D6ECF4"},{"from":45,"to":90,"color":"#D6ECF4"},{"from":90,"to":135,"color":"#D6ECF4"},{"from":135,"to":180,"color":"#D6ECF4"},{"from":180,"to":225,"color":"#D6ECF4"},{"from":225,"to":270,"color":"#D6ECF4"},{"from":270,"to":315,"color":"#D6ECF4"},{"from":315,"to":360,"color":"#D6ECF4"}]}
			);
			
			gwdir.draw();
		  

			//Init gauge
			var gwdiravg= new RadialGauge
			(
				'wdiravg',
				{"altValue":true,"majorTicks":["N","NE","E","SE","S","SW","W","NW"],"cardinals":["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"],"id":"wdiravg","dirGauge":true,"minValue":0,"maxValue":360,"minorTicks":0,"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":45,"color":"#D6ECF4"},{"from":45,"to":90,"color":"#D6ECF4"},{"from":90,"to":135,"color":"#D6ECF4"},{"from":135,"to":180,"color":"#D6ECF4"},{"from":180,"to":225,"color":"#D6ECF4"},{"from":225,"to":270,"color":"#D6ECF4"},{"from":270,"to":315,"color":"#D6ECF4"},{"from":315,"to":360,"color":"#D6ECF4"}]}
			);
			
			gwdiravg.draw();
		  

			//Init gauge
			var gwelev= new RadialGauge
			(
				'welev',
				{"majorTicks":["N","NE","E","SE","S","SW","W","NW"],"id":"welev","dirGauge":true,"minValue":0,"maxValue":360,"minorTicks":0,"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":45,"color":"#D6ECF4"},{"from":45,"to":90,"color":"#D6ECF4"},{"from":90,"to":135,"color":"#D6ECF4"},{"from":135,"to":180,"color":"#D6ECF4"},{"from":180,"to":225,"color":"#D6ECF4"},{"from":225,"to":270,"color":"#D6ECF4"},{"from":270,"to":315,"color":"#D6ECF4"},{"from":315,"to":360,"color":"#D6ECF4"}]}
			);
			
			gwelev.draw();
		  

			//Init gauge
			var gwelevavg= new RadialGauge
			(
				'welevavg',
				{"altValue":true,"majorTicks":["N","NE","E","SE","S","SW","W","NW"],"cardinals":["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"],"id":"welevavg","dirGauge":true,"minValue":0,"maxValue":360,"minorTicks":0,"colors":{"majorTicks":"#FFFFFF"},"strokeTicks":false,"highlights":[{"from":0,"to":45,"color":"#D6ECF4"},{"from":45,"to":90,"color":"#D6ECF4"},{"from":90,"to":135,"color":"#D6ECF4"},{"from":135,"to":180,"color":"#D6ECF4"},{"from":180,"to":225,"color":"#D6ECF4"},{"from":225,"to":270,"color":"#D6ECF4"},{"from":270,"to":315,"color":"#D6ECF4"},{"from":315,"to":360,"color":"#D6ECF4"}]}
			);
			
			gwelevavg.draw();
		  
jQuery('body').popover({'selector':'a\x5Brel\x3Dpopover\x5D'});
jQuery('body').tooltip({'selector':'a\x5Brel\x3Dtooltip\x5D'});
jQuery('#no-feature-upgrade-account').modal({'backdrop':true,'keyboard':true,'show':false});
jQuery('#login-modal').modal({'backdrop':true,'keyboard':true,'show':false});
jQuery("#login-modal").on("shown", function(){$("#LoginForm_entity").focus()});
jQuery('#register-modal').modal({'backdrop':true,'keyboard':true,'show':false});
jQuery('#settings-modal').modal({'backdrop':true,'keyboard':true,'show':false});
CookieMonster.init({"path":"\/","expires":90,"secure":false,"classOuter":"CookieMonsterBox","classInner":"container","classButton":"btn.btn-primary.pull-right"});
jQuery(function($) {
$("a[rel=popover]").on("click", function(e){e.preventDefault();}).popover({"placement":"top", "trigger":"hover"});

  $(function(){
   $('#settings-form .btn-group a').click(function(){
    var fieldId = $(this).data('field');
    var value = $(this).data('value');
    $('#' + fieldId).val(value); 
   });
  });

});
/*]]>*/
