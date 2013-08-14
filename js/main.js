/**
 * Main
 */
(function ($) {
    'use strict';

    var Main = {
        init: function() {
            this.appendDateOptions();
            this.watchDateChange();
            this.preloadDates();
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

        watchDateChange: function() {
            var $selectInputs = $('#date-input select');

            $selectInputs.change(function() {
                var emptyOptions = $selectInputs.filter(function() {return !$(this).val();});

                // calculate when all date options selected
                if (emptyOptions.length == 0) {
                    var inputValues = $selectInputs.serializeArray();
                    var compatibility = Main.calculateMaximums(inputValues);

                    // draw compatibility graph
                    Main.resizeBars(compatibility);

                    // change URI string to reflect dates
                    Main.changeLocationHash(inputValues);

                    // remember first date
                    Main.saveDate(inputValues);
                }
            });
        },

        preloadDates: function() {
            // load first date from localstorage
            if (this.supportsLocalStorage) {
                var storedDate = localStorage['ddmmyyy'];

                if (storedDate) {
                    $('select[name=dd]').val( storedDate.slice(0, 2) );
                    $('select[name=mm]').val( storedDate.slice(2, 4) );
                    $('select[name=yyyy]').val( storedDate.slice(4, 8) );
                }
            }

            // set dates from location hash
            var hash = window.location.hash.slice(1);
            var validHash = hash.match(/^(\d{8})-(\d{8})$/);

            if (validHash) {
                var dd = hash.slice(0, 2),
                    mm = hash.slice(2, 4),
                    yyyy = hash.slice(4, 8),
                    dd2 = hash.slice(9, 11),
                    mm2 = hash.slice(11, 13),
                    yyyy2 = hash.slice(13, 17);

                // set only if such values exist
                if ( $('select[name=dd] > option[value='+dd+']').length
                    && $('select[name=mm] > option[value='+mm+']').length
                    && $('select[name=yyyy] > option[value='+yyyy+']').length
                    && $('select[name=dd2] > option[value='+dd2+']').length
                    && $('select[name=mm2] > option[value='+mm2+']').length
                    && $('select[name=yyyy2] > option[value='+yyyy2+']').length )
                {
                    $('select[name=dd]').val(dd);
                    $('select[name=mm]').val(mm);
                    $('select[name=yyyy]').val(yyyy);
                    $('select[name=dd2]').val(dd2);
                    $('select[name=mm2]').val(mm2);
                    $('select[name=yyyy2]').val(yyyy2);
                }

                $('#date-input select').change();
            }
        },

        resizeBars: function(graphData) {
            // { physical: '81%', emotional: '92%', intellectual: '66%', average: '90%' };
            $.each(graphData, function(i, val) {
                //val = Math.round(val) + '%';
                val = val + '%';

                var $context = $('.' + i);
                $context.attr( 'title', $context.attr('title').replace(/[0-9]+%/g, val) );
                $('.percent', $context).html(val);
                $('.percentage-bar', $context).width(val);
            });

        },

        // Summed maximum: Compatibility % = 100 * Abs(cos(pi * d / p))
        calculateMaximums: function(inputValues) {
            var firstDate = new Date(
                parseInt(inputValues[2].value),
                parseInt(inputValues[1].value - 1),
                parseInt(inputValues[0].value)
            ); // yyyy, mm, dd

            var secondDate = new Date(
                parseInt(inputValues[5].value),
                parseInt(inputValues[4].value - 1),
                parseInt(inputValues[3].value)
            ); // yyyy2, mm2, dd2

            // hours * minutes * seconds * milliseconds
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (24 * 60 * 60 * 1000)));

            var compatibilityPhysical = Math.round(100 * Math.abs(Math.cos(Math.PI * diffDays / 23)));
            var compatibilityEmotional = Math.round(100 * Math.abs(Math.cos(Math.PI * diffDays / 28)));
            var compatibilityIntellectual = Math.round(100 * Math.abs(Math.cos(Math.PI * diffDays / 33)));
            var compatibilityAverage = Math.round((compatibilityPhysical + compatibilityEmotional + compatibilityIntellectual) / 3);

            var compatibility = {
                'physical': compatibilityPhysical,
                'emotional': compatibilityEmotional,
                'intellectual': compatibilityIntellectual,
                'average': compatibilityAverage
            };

            return compatibility;
        },

        changeLocationHash: function(inputValues) {
            var hashData = [];
            $.each(inputValues, function(i, obj) {
                hashData.push(obj.value);
                if (i == 2) { hashData.push('-'); }
            });
            window.location.hash = hashData.join('');
        },

        saveDate: function(inputValues) {
            if (!this.supportsLocalStorage()) { return false; }

            var storedDateValues = [];
            for (var i = 0; i <= 2; i++) {
                storedDateValues.push(inputValues[i].value);
            }

            // save first date to localstorage
            localStorage['ddmmyyy'] = storedDateValues.join('');
        },

        // verify if local storage supported
        supportsLocalStorage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch(e) {
                return false;
            }
        }
    };

    Main.init();

})(jQuery);