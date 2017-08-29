ym.modules.define('test.system.provideCss', [
    'system.provideCss'
], function (provide, provideCss) {

    describe('test.system.provideCss', function () {
        var headElement,
            styleElement,
            eventListener,
            css = ".ymaps_maps-button{display:inline-block;margin:0;padding:0;min-width:36px;height:36px;" +
                "outline:0;border-width:0;border-radius:36px;background-color:#fff;box-shadow:0 2px 3px 1px " +
                "rgba(0,0,0,.2);color:#333;vertical-align:middle;text-align:left;font-family:Arial,Helvetica," +
                "sans-serif;line-height:36px;cursor:pointer;transition:box-shadow .2s cubic-bezier(.455,.03,.515," +
                ".955),background-color .2s cubic-bezier(.455,.03,.515,.955),opacity .2s cubic-bezier(.455,.03,.515," +
                ".955);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;" +
                "position:relative;white-space:nowrap;font-size:15px}.ymaps_maps-button:hover{box-shadow:0 3px 4px " +
                "1px rgba(0,0,0,.3)}.ymaps_maps-button.ymaps__pressed{box-shadow:0 2px 3px 1px rgba(0,0,0,.12);" +
                "opacity:.95}.ymaps_maps-button.ymaps__disabled{background-color:#ebebeb;box-shadow:none;cursor:" +
                "default}.ymaps_maps-button__text,.ymaps_maps-button__icon{display:inline-block;vertical-align:top}" +
                ".ymaps_maps-button__text{position:relative;display:block;overflow:hidden;margin:0;padding:0 20px 0" +
                " 44px;border:none;background:0 0;color:#333;text-decoration:none;text-overflow:ellipsis;white-space:" +
                "nowrap;transition:color .2s cubic-bezier(.455,.03,.515,.955)}.ymaps_maps-button.ymaps__text_only " +
                ".ymaps_maps-button__text{padding-left:20px}.ymaps_maps-button__icon{position:absolute;top:0;left:0;" +
                "margin-left:6px;padding:5px;width:26px;height:26px;transition:opacity .2s cubic-bezier(.455,.03,.515," +
                ".955)}.ymaps_maps-button.ymaps__icon_only .ymaps_maps-button__icon{margin-left:0}.ymaps_maps-button." +
                "ymaps__checked{background-color:#ffeba0}.ymaps_maps-button.ymaps__checked .ymaps_maps-button__text" +
                "{color:#746233}.ymaps_maps-button.ymaps__disabled .ymaps_maps-button__icon{opacity:.75}.ymaps_maps-" +
                "button.ymaps__checked.ymaps__disabled{background:#fff8db}";

        before(function(){
            headElement = document.getElementsByTagName('head')[0];
        });

        afterEach(function(){
            headElement.removeChild(styleElement);
            headElement.removeEventListener('DOMNodeInserted', eventListener);
        });

        after(function(){
            headElement = null;
        });

        it('The number of style tags should be greater by one after using provideCss()', function (done) {
            var styles = document.getElementsByTagName('style').length;
            eventListener = function(){
                styleElement = document.getElementsByTagName('style')[0];

                expect(document.getElementsByTagName('style').length).to.be(styles + 1);
                expect(styleElement.type).to.be('text/css');
                expect(styleElement.rel).to.be('stylesheet');
                expect(styleElement.getAttribute('data-ymaps')).to.be('css-modules');
                expect(styleElement.innerHTML).to.be(css + '\n/**/\n');

                done();
            };
            headElement.addEventListener('DOMNodeInserted', eventListener);
            provideCss(css, {});
        });

        it('Must combine css', function (done) {
            var styles = document.getElementsByTagName('style').length;
            eventListener = function(){
                styleElement = document.getElementsByTagName('style')[0];
                expect(document.getElementsByTagName('style').length).to.be(styles + 1);

                expect(styleElement.type).to.be('text/css');
                expect(styleElement.rel).to.be('stylesheet');
                expect(styleElement.getAttribute('data-ymaps')).to.be('css-modules');
		        expect(styleElement.innerHTML).to.be(css + '\n/**/\n' + css + '\n/**/\n' + css + '\n/**/\n');

                done();
            };
            provideCss(css, {});
            provideCss(css, {});
            headElement.addEventListener('DOMNodeInserted', eventListener);
            provideCss(css, {});

        });
    });

    provide({});
});
