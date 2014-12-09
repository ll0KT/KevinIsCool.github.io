/**
 * Modified by Kevin on 12/09/14.
 */

$(function(){
    var $point = $('#point'), $iPost = $('#w-post'), $iAbout = $('#w-about'), $iTags = $('#w-tags'), $iNone = $('#w-none');

    var _ = {
        showWord: function(obj, word, link){
            var $word = $('#word');
            obj.mouseover(function() {
                $word.fadeIn(800, function() {
                    $word.empty().append(word);
                });
            }).mouseleave(function() {
                $word.fadeOut(100).empty();
            }).click(function() {
                window.location = link;
            });
        }
    };
    
    $point.mouseover(function() {
        $('#w-post').fadeIn(200);
        $('#w-about').fadeIn(600);
        $('#w-tags').fadeIn(1000);
        $('#w-none').fadeIn(1400);
        $('#word').fadeIn(300, function() {
            $(this).empty().append('----------');
        });

    }).mouseleave(function () {
        $('#word').fadeOut(300).empty();
    });

    _.showWord($iPost, '----------', 'http://www.llokt.com/Kevin');
    _.showWord($iAbout, '----------', 'http://www.llokt.com/Kevin/about');
    _.showWord($iTags, '----------', 'http://www.llokt.com/Kevin/tags');
    _.showWord($iNone, '----------', 'http://www.llokt.com');

});
