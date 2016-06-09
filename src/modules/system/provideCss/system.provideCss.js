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
        URL = window.URL || window.webkitURL || window.mozURL,
        csp = ym.env.server.params.csp,
        pasteAsLink = csp && !csp.style_nonce;


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

        if (!tag) {
            tag = document.createElement(pasteAsLink ? "link" : "style");
            tag.type = "text/css";
            tag.rel = "stylesheet";
            tag.setAttribute && tag.setAttribute('data-ymaps', 'css-modules');
            if (csp && csp.style_nonce) {
                tag.setAttribute && tag.setAttribute('nonce', csp.style_nonce);
            }
        }

        if (tag.styleSheet) {
            cssText += newCssText;
            tag.styleSheet.cssText = cssText;
            if (!tag.parentNode) {
                document.getElementsByTagName("head")[0].appendChild(tag);
            }
        } else {
            if (pasteAsLink) {
                var blob = new Blob([newCssText], {type: 'text/css'}),
                    tempUrl = URL.createObjectURL(blob);
                tag.setAttribute("href", tempUrl);
            } else {
                tag.appendChild(document.createTextNode(newCssText));
            }
            document.getElementsByTagName("head")[0].appendChild(tag);
            tag = null;
        }
        newCssText = '';
        var cb = callbacks;
        callbacks = [];
        for (var i = 0, l = cb.length; i < l; ++i) {
            cb[i]();
        }
    }
});