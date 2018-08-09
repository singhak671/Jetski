    $(document).ready(function(){
    // Strat for left menu
        $('.mobmenu').on('click', function(){
          $('.left-section').toggleClass('left-section-show');
        });

        $(document).click(function(e) {
          if(!$(e.target).is(".left-section, .left-section *, .menubox, .menubox *")) {
            $('.left-section').removeClass('left-section-show');
          }
        });
    });
    // End for left menu