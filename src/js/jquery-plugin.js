if (typeof jQuery === 'undefined') {
    throw new Error('Jquery Plugins\'s JavaScript requires jQuery')
}

+function ($) {
    var element = $('body');
    element.css('background', '#eeeeee');
    console.log('Ok');
}(jQuery);