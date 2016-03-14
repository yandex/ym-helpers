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
        inState = 0,
        svgSaltPlace = 'charset=svgsalt-' + (new Date());

    provide(function (cssText, callback) {
        // В dataURI SVG может быть специальное место, для вставки уникального блока
        // в целях "пробития" кеша в ИЕ. Иначе некоторые обьекты (метки) не отображаются. MAPSAPI-9741.
        newCssText += cssText.replace(/svgSaltSeed/g, svgSaltPlace) + '\n/**/\n';
        callbacks.push(callback);
        //writeCSSModules();
        //return;
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
            tag = document.createElement("style");
            tag.type = "text/css";
            tag.setAttribute && tag.setAttribute('data-ymaps', 'css-modules');
        }

        if (tag.styleSheet) {
            cssText += newCssText;
            tag.styleSheet.cssText = cssText;
            if (!tag.parentNode) {
                document.getElementsByTagName("head")[0].appendChild(tag);
            }
        } else {
            tag.appendChild(document.createTextNode(newCssText));
            document.getElementsByTagName("head")[0].appendChild(tag);
            tag = null;
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