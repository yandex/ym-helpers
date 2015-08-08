/**
 * @fileOverview
 * Query string library. Original code by Azat Razetdinov <razetdinov@ya.ru>.
 */
ym.modules.define('util.queryString', [], function (provide) {
    function isArray(x) {
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
            var eq = (options && options.eq) || '=',
                sep = (options && options.sep) || '&',
                unescape = options && typeof options.unescape === 'function' ?
                    options.unescape : decodeURIComponent,
                result = {},
                stringTokens = String(string).split(sep),
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
         * @return {String} Query string.
         */
        stringify: function (params, options) {
            var eq = (options && options.eq) || '=',
                sep = (options && options.sep) || '&',
                escape = options && typeof options.escape === 'function' ?
                    options.escape : encodeURIComponent,
                result = [],
                name, value;

            function addParam(result, name, value) {
                if (typeof value !== 'undefined') {
                    result.push(escape(name) + eq + escape(value));
                }
            }

            for (var name in params) {
                if (params.hasOwnProperty(name)) {
                    var value = params[name];
                    if (isArray(value)) {
                        for (var i = 0; i < value.length; ++i) {
                            addParam(result, name, value[i]);
                        }
                    } else {
                        addParam(result, name, value);
                    }
                }
            }

            return result.join(sep);
        }
    });
});
