/**
 * Main
 */
(function ($) {
    'use strict';

    var Main = {
        init: function() {
            this.appendDateOptions();
            this.watchDateChange();
            // this.setDateByHash(); ?
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
            var yearStart = (new Date()).getFullYear() - 13;

            for (var y = yearStart; y >= 1950; y--) {
                years.push('<option value="' + y + '">' + y + '</option>');
            }

            $('select[name^=dd]').append(days.join(''));
            $('select[name^=mm]').append(months.join(''));
            $('select[name^=yyyy]').append(years.join(''));
        },

        resizeBars: function(graphData) {
            // { physical: '81%', emotional: '92%', intellectual: '66%', average: '90%' };
            $.each(graphData, function(i, val) {
                val = Math.round(val) + '%';

                var $context = $('.' + i);
                $context.attr( 'title', $context.attr('title').replace(/[0-9]+%/g, val) );
                $('.percent', $context).html(val);
                $('.percentage-bar', $context).width(val);
            });

        },

        watchDateChange: function() {
            var $selectInputs = $('#date-input select');

            $selectInputs.change(function() {
                var emptyOptions = $selectInputs.filter(function() {return !$(this).val();});

                // calculate when all date options selected
                if (emptyOptions.length == 0) {
                    var compatibility = Main.calculateMaximums($selectInputs.serializeArray());
                    Main.resizeBars(compatibility);
                }
            });
        },

        // Summed maximum: Compatibility % = 100 * Abs(cos(pi * d / p))
        calculateMaximums: function(dateOptions) {
            var firstDate = new Date(
                parseInt(dateOptions[2].value),
                parseInt(dateOptions[1].value - 1),
                parseInt(dateOptions[0].value)
            ); // yyyy, mm, dd

            var secondDate = new Date(
                parseInt(dateOptions[5].value),
                parseInt(dateOptions[4].value - 1),
                parseInt(dateOptions[3].value)
            ); // yyyy2, mm2, dd2

            // hours * minutes * seconds * milliseconds
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (24 * 60 * 60 * 1000)));

            var compatibilityPhysical = 100 * Math.abs(Math.cos(Math.PI * diffDays / 23));
            var compatibilityEmotional = 100 * Math.abs(Math.cos(Math.PI * diffDays / 28));
            var compatibilityIntellectual = 100 * Math.abs(Math.cos(Math.PI * diffDays / 33));
            var compatibilityAverage = (compatibilityPhysical + compatibilityEmotional + compatibilityIntellectual) / 3;

            var compatibility = {
                'physical': compatibilityPhysical,
                'emotional': compatibilityEmotional,
                'intellectual': compatibilityIntellectual,
                'average': compatibilityAverage
            };

            return compatibility;
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