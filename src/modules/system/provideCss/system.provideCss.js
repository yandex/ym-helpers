ym.modules.define('system.provideCss', ['system.nextTick'], function (provide, nextTick) {
    var newCssText = '',
    /*
     в слайсах IE 7 нельзя читать содержимое тега link MAPSAPI-4755
     поэтому аккумулируем весь css в одной переменной
     */
        cssText = '',
        callbacks = [],
    /*
     Для IE используем один тег под все стили
     http://dean.edwards.name/weblog/2010/02/bug85/
     */
        tag,
        waitForNextTick = false,
        inState = 0;

    provide(function (cssText, callback) {
        newCssText += cssText + '\n/**/\n';
        if (callback) {
            callbacks.push(callback);
        }

        if (!waitForNextTick) {
            nextTick(writeCSSModules);
            waitForNextTick = true;
        }
    });

    function writeCSSModules () {
        waitForNextTick = false;
        if (!callbacks.length) {
            return;
        }

        var CSP_ENABLED = ym.env.server.params.follow_csp;

        if (!tag) {
            tag = document.createElement(CSP_ENABLED ? "link" : "style");
            tag.type = "text/css";
            tag.rel = "stylesheet";
            tag.setAttribute && tag.setAttribute('data-ymaps', 'css-modules');
            if (CSP_ENABLED && CSP_ENABLED.nonceForStyle) {
                tag.setAttribute && tag.setAttribute('nonce', CSP_ENABLED.nonceForStyle);
            }
        }

        if (tag.styleSheet) {
            cssText += newCssText;
            tag.styleSheet.cssText = cssText;
            if (!tag.parentNode) {
                document.getElementsByTagName("head")[0].appendChild(tag);
            }
        } else {
            if (CSP_ENABLED) {
                //cssText += newCssText;
                var blob = new Blob([newCssText], {type: 'text/css'});
                var tempUrl = (window.URL || window.webkitURL || window.mozURL).createObjectURL(blob);
                tag.setAttribute("href", tempUrl);
                document.getElementsByTagName("head")[0].appendChild(tag);
                tag = null;
            } else {
                tag.appendChild(document.createTextNode(newCssText));
                document.getElementsByTagName("head")[0].appendChild(tag);
                tag = null;
            }
        }
        inState = 1;
        newCssText = '';
        var cb = callbacks;
        callbacks = [];
        for (var i = 0, l = cb.length; i < l; ++i) {
            cb[i]();
        }
        inState = 0;
    };
});