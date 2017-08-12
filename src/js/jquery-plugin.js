if (typeof jQuery === 'undefined') {
    throw new Error('Jquery Plugins\'s JavaScript requires jQuery')
}

+function ($) {
    var element = $('body');
    element.css('font-size', '30px');
}(jQuery);