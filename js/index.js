$(document).ready(function() {
    $('.rollover').css('display', 'none');
    $('.icons').hover(function() {
        $(this).children('.rollover').fadeIn(250);
    }, function() {
        $(this).children('.rollover').fadeOut(250);
    });
});