
$('#ad-box-close').on('click', function(e){e.preventDefault();$('#ad-box').hide();});
setTimeout(function(){$('#ad-box-close').show();}, 2000);
$(document).ready(function(){checkBlock(function(){$('#disclaimer-box').show()})});
