$(document).ready(function() {
    $('.rollover').css('display', 'none');
    $('.icons').hover(function() {
        $(this).children('.rollover').fadeIn(250);
    }, function() {
        $(this).children('.rollover').fadeOut(250);
    });
});

$(document).ready(function() {
    $('.rollover-regions').css('display', 'none');
    $('.icons-regions').hover(function() {
        $(this).children('.rollover-regions').fadeIn(100);
    }, function() {
        $(this).children('.rollover-regions').fadeOut(100);
    });
});