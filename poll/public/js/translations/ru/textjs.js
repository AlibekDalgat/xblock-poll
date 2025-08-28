(function(global){
    var PollXBlockI18N = {
        init: function() {
            (function(globals) {
                var django = globals.django || (globals.django = {});

                django.pluralidx = function(n) {
                    var v = (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
                    if (typeof(v) == 'boolean') {
                        return v ? 1 : 0;
                    } else {
                        return v;
                    }
                };

                django.catalog = django.catalog || {};

                var newcatalog = {
                    "Answer": "Ответ",
                    "Delete": "Удалить",
                    "Feedback": "Отзыв",
                    "Image URL": "URL изображения",
                    "Image alternative text": "Альтернативный текст изображения",
                    "Question": "Вопрос",
                    "Results": "Результаты",
                    "Results gathered from {total} respondent.": [
                        "Результаты собраны от {total} респондента.",
                        "Результаты собраны от {total} респондентов.",
                        "Результаты собраны от {total} респондентов."
                    ],
                    "Submit": "Отправить",
                    "This must have an image URL or text, and can have both.  If you add an image, you must also provide an alternative text that describes the image in a way that would allow someone to answer the poll if the image did not load.": "Необходимо указать URL изображения или текст, можно и то, и другое. Если вы добавляете изображение, вы также должны предоставить альтернативный текст, описывающий изображение таким образом, чтобы пользователь мог ответить на опрос, если изображение не загрузилось.",
                    "You can make limited use of Markdown in answer texts, preferably only bold and italics.": "Вы можете ограниченно использовать Markdown в текстах ответов, предпочтительно только жирный шрифт и курсив.",
                    "move poll up": "переместить опрос вверх",
                    "move poll down": "переместить опрос вниз"
                };
                for (var key in newcatalog) {
                    django.catalog[key] = newcatalog[key];
                }

                if (!django.jsi18n_initialized) {
                    django.gettext = function(msgid) {
                        var value = django.catalog[msgid];
                        if (typeof(value) == 'undefined') {
                            return msgid;
                        } else {
                            return (typeof(value) == 'string') ? value : value[0];
                        }
                    };

                    django.ngettext = function(singular, plural, count) {
                        var value = django.catalog[singular];
                        if (typeof(value) == 'undefined') {
                            return (count == 1) ? singular : plural;
                        } else {
                            return value.constructor === Array ? value[django.pluralidx(count)] : value;
                        }
                    };

                    django.gettext_noop = function(msgid) { return msgid; };

                    django.pgettext = function(context, msgid) {
                        var value = django.gettext(context + '\x04' + msgid);
                        if (value.indexOf('\x04') != -1) {
                            value = msgid;
                        }
                        return value;
                    };

                    django.npgettext = function(context, singular, plural, count) {
                        var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
                        if (value.indexOf('\x04') != -1) {
                            value = django.ngettext(singular, plural, count);
                        }
                        return value;
                    };

                    django.interpolate = function(fmt, obj, named) {
                        if (named) {
                            return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
                        } else {
                            return fmt.replace(/%s/g, function(match){return String(obj.shift())});
                        }
                    };

                    django.formats = {
                        "DATETIME_FORMAT": "j F Y H:i",
                        "DATETIME_INPUT_FORMATS": [
                            "%d.%m.%Y %H:%M:%S",
                            "%d.%m.%Y %H:%M:%S.%f",
                            "%d.%m.%Y %H:%M",
                            "%d.%m.%Y",
                            "%Y-%m-%d %H:%M:%S",
                            "%Y-%m-%d %H:%M:%S.%f",
                            "%Y-%m-%d %H:%M",
                            "%Y-%m-%d"
                        ],
                        "DATE_FORMAT": "j F Y",
                        "DATE_INPUT_FORMATS": [
                            "%d.%m.%Y",
                            "%d.%m.%y",
                            "%Y-%m-%d"
                        ],
                        "DECIMAL_SEPARATOR": ",",
                        "FIRST_DAY_OF_WEEK": 1,
                        "MONTH_DAY_FORMAT": "j F",
                        "NUMBER_GROUPING": 3,
                        "SHORT_DATETIME_FORMAT": "j N Y H:i",
                        "SHORT_DATE_FORMAT": "j N Y",
                        "THOUSAND_SEPARATOR": "\u00a0",
                        "TIME_FORMAT": "H:i",
                        "TIME_INPUT_FORMATS": [
                            "%H:%M:%S",
                            "%H:%M:%S.%f",
                            "%H:%M"
                        ],
                        "YEAR_MONTH_FORMAT": "F Y"
                    };

                    django.get_format = function(format_type) {
                        var value = django.formats[format_type];
                        if (typeof(value) == 'undefined') {
                            return format_type;
                        } else {
                            return value;
                        }
                    };

                    globals.pluralidx = django.pluralidx;
                    globals.gettext = django.gettext;
                    globals.ngettext = django.ngettext;
                    globals.gettext_noop = django.gettext_noop;
                    globals.pgettext = django.pgettext;
                    globals.npgettext = django.npgettext;
                    globals.interpolate = django.interpolate;
                    globals.get_format = django.get_format;

                    django.jsi18n_initialized = true;
                }
            }(this));
        }
    };
    PollXBlockI18N.init();
    global.PollXBlockI18N = PollXBlockI18N;
}(this));