/**
 * Modified by Kevin on 12/09/2014.
 */
var currentScroll = 0,
    allWords = [{
        'id': 1,
        'title': '',
        'content': '-',
        'author': ''
    }, {
        'id': 2,
        'title': '',
        'content': '--',
        'author': '--'
    }, {
        'id': 3,
        'title': '',
        'content': '---',
        'author': '---'
    }, {
        'id': 4,
        'title': '',
        'content': '----',
        'author': '----'
    }, {
        'id': 5,
        'title': '',
        'content': '-----',
        'author': '-----'
    }, {
        'id': 6,
        'title': '',
        'content': '------',
        'author': '------'
    }, {
        'id': 7,
        'title': '',
        'content': '-------',
        'author': '-------'
    }];

$(function(){
    $(window).scroll(function(){
        myScroll();
    });

    showBeautifulWords();
});

function myScroll() {
    var nextScroll = $(this).scrollTop(), $header = $('#header');
//            console.log('scrollPosition' + $(document).scrollTop() + 'currentScroll: => ' + currentScroll + '  nextScroll: => ' + nextScroll);
    if (nextScroll > currentScroll){
        $header.removeClass('in bgColor').addClass('out');
        if (nextScroll >= $(document).height()-$(window).height()){
            $header.removeClass('out').addClass('in bgColor');
        }
        if ($(document).scrollTop() <= 0) {
            $header.removeClass('out').addClass('in');
            $header.removeClass('bgColor');
        }
    } else {
        $header.removeClass('out').addClass('in bgColor');
        if ($(window).scrollTop() >= 0 && $(window).scrollTop() <= 100) {
            $header.removeClass('bgColor');
        }
    }

    if ($(window).width() >= 1000) {
        $header.removeClass('bgColor');
    }

    //Updates current scroll position
    currentScroll = nextScroll;
}

function showBeautifulWords() {

    var self = $('#logo');
    self.addClass('logo-in')
        .mouseover(function () {
        var ranWord = Math.floor(Math.random() * allWords.length), wordDom = '<div class="logo-word"><div class="logo-title">' + allWords[ranWord]['title'] + '</div><div class="logo-content"><span></span>' + allWords[ranWord]['content'] + '</div><div class="logo-author">' + allWords[ranWord]['author'] + '</div></div>';

        self.removeClass('logo-in').addClass('logo-out');
        if ($('.logo-word').length <= 0)
            setTimeout(function(){self.append(wordDom);}, 500);
    }).mouseleave(function () {
        self.removeClass('logo-out').addClass('logo-in');
        var logoWord = $('.logo-word');
        if (logoWord) {
            logoWord.fadeOut(50, function () {
                self.empty();
            })
        }
    });
}
