/**
 * Main
 */
(function ($) {
    'use strict';

    var Main = {
        init: function() {
            this.appendDateOptions();
            this.resizeBars();
        },

        appendDateOptions: function() {
            var days = [], months = [], years = [];

            // days/months range
            for (var i = 1; i <= 31; i++) {
                var num = ('0' + i).slice(-2);
                days.push('<option value="' + num + '">' + num + '</option>');

                // push months as well
                if (i <= 12) {
                    months.push('<option value="' + num + '">' + num + '</option>');
                }
            }

            // years range
            for (var y = 2000; y >= 1950; y--) {
                years.push('<option value="' + y + '">' + y + '</option>');
            }

            $('select[data-option=dd]').append(days.join(''));
            $('select[data-option=mm]').append(months.join(''));
            $('select[data-option=yyyy]').append(years.join(''));
        },

        resizeBars: function() {
            var cycles = { physical: '81%', emotional: '92%', intellectual: '66%', total: '90%' };
            $.each(cycles, function(i, val) {
                var $context = $('.' + i);
                $context.attr('title', $context.attr('title') + ': ' + val);
                $('.percent', $context).html(val);
                $('.percentage-bar', $context).width(val);
            });

        }
    };

    Main.init();

})(jQuery);

/**
 * Share.pluso.ru
 */
//(function() {
//    if (window.pluso)if (typeof window.pluso.start == "function") return;
//    var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
//    s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
//    s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://share.pluso.ru/pluso-like.js';
//    var h=d[g]('head')[0] || d[g]('body')[0];
//    h.appendChild(s);
//})();