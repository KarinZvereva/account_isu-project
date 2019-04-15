$(function() {
var field = $('#list').find('option');
 
// собственно поиск
$('#searchInput').bind('keyup', function() {
    var q = new RegExp($(this).val(), 'ig');
 
    for (var i = 0, l = field.length; i < l; i += 1) {
        var option = $(field[i]),
            parent = option.parent();

        if ($(field[i]).text().match(q)) {
            if (parent.is('span')) {
                option.show();
                parent.replaceWith(option);
            }
        } else {
            if (option.is('option') && (!parent.is('span'))) {
                option.wrap('<span>').hide();
            }
        }
    } 
});
});