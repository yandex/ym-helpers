/**
 * @fileOverview
 * Query string library. Original code by Azat Razetdinov <razetdinov@ya.ru>.
 */
ym.modules.define('util.querystring', [], function (provide) {
    function isArray (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }

    provide({
        /**
         * Parse query string.
         *
         * @function
         * @static
         * @name util.querystring.parse
         * @param {String} string Query string.
         * @param {String} [sep = '&'] Param-param delimiter.
         * @param {String} [eq = '='] Name-value delimiter.
         * @param {Object} [options] Options.
         * @param {Function} [options.decodeURIComponent = decodeURIComponent] Unescape function.
         * @returns {Object} Query params.
         */
        parse: function (string, sep, eq, options) {
            sep = sep || '&';
            eq = eq || '=';
            options = options || {};
            var unescape = options.decodeURIComponent || decodeURIComponent,
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
         * @param {String} [sep = '&'] Param-param delimiter.
         * @param {String} [eq = '='] Name-value delimiter.
         * @param {Object} [options] Options.
         * @param {Function} [options.encodeURIComponent = encodeURIComponent] Escape function.
         * @returns {String} Query string.
         */
        stringify: function (params, sep, eq, options) {
            sep = sep || '&';
            eq = eq || '=';
            options = options || {};
            var escape = options.encodeURIComponent || encodeURIComponent,
                result = [],
                name, value;

            for (name in params) {
                if (params.hasOwnProperty(name)) {
                    value = params[name];
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
