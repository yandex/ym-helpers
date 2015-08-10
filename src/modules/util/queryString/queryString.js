/**
 * @fileOverview
 * Query string library. Original code by Azat Razetdinov <razetdinov@ya.ru>.
 */
ym.modules.define('util.queryString', [], function (provide) {
    function isArray (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }

    provide({
        /**
         * Parse query string.
         *
         * @function
         * @static
         * @name util.queryString.parse
         * @param {String} string Query string.
         * @param {Object} [options] Options.
         * @param {String} [options.eq] Name-value delimiter.
         * @param {String} [options.sep] Param-param delimiter.
         * @param {Function} [options.unescape] Unescape function.
         * @returns {Object} Query params.
         */
        parse: function (string, options) {
            options = options || {};
            var eq = options.eq || '=',
                sep = options.sep || '&',
                unescape = options.unescape || decodeURIComponent,
                result = {},
                stringTokens = string.split(sep),
                param, name, value;

            for (var i = 0; i < stringTokens.length; ++i) {
                param = stringTokens[i].split(eq);
                name = unescape(param[0]);
                value = unescape(param.slice(1).join(eq));

                if (isArray(result[name])) {
                    result[name].push(value);
                } else if (result.hasOwnProperty(name)) {
                    result[name] = [result[name], value];
                } else {
                    result[name] = value;
                }
            }

            return result;
        },

        /**
         * Stringify query params.
         *
         * @ignore
         * @function
         * @static
         * @name util.queryString.stringify
         * @param {Object} params Query params.
         * @param {Object} [options] Options.
         * @param {String} [options.eq] Name-value delimiter.
         * @param {String} [options.sep] Param-param delimiter.
         * @param {Function} [options.escape] Escape function.
         * @returns {String} Query string.
         */
        stringify: function (params, options) {
            options = options || {};
            var eq = options.eq || '=',
                sep = options.sep || '&',
                escape = options.escape || encodeURIComponent,
                result = [],
                name, value;

            for (var name in params) {
                if (params.hasOwnProperty(name)) {
                    var value = params[name];
                    if (isArray(value)) {
                        for (var i = 0; i < value.length; ++i) {
                            if (typeof value != 'undefined') {
                                result.push(escape(name) + eq + escape(value));
                            }
                        }
                    } else {
                        if (typeof value != 'undefined') {
                            result.push(escape(name) + eq + escape(value));
                        }
                    }
                }
            }

            return result.join(sep);
        }
    });
});
