
    $('.password_toggle_visibility').on('click', function(e){
        e.preventDefault();
        $(this).find('i').toggleClass('icon-eye-open icon-eye-slash');
        
        var x = document.getElementById($(this).data('id'));
        
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    })
    