if (typeof jQuery === 'undefined') {
    throw new Error('Jquery Plugins\'s JavaScript requires jQuery')
}

+function ($) {
    var element = $('body');
    // element.css('background', '#81c784');
    console.log('Ok');
}(jQuery);