ym.modules.define('test.util.script', [
    'util.script'
], function (provide, utilScript) {

    describe('test.util.script', function () {
        var headElement;

        before(function(){
            headElement = document.getElementsByTagName('head')[0];
        });

        after(function(){
            headElement = null;
        });

        it('The number of script tags should be greater by one after using utilScript.create()', function (done) {

            var scripts = document.getElementsByTagName('script').length;
            function eventListener() {
                var scriptElement = document.getElementsByTagName('script')[0];
                expect(document.getElementsByTagName('script').length).to.be(scripts + 1);
                expect(scriptElement.src).to.be('https://example.net/');
                expect(scriptElement.charset).to.be('utf-8');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('https://example.net/', 'utf-8');
        });

        it('Should add script to the page with encoding "koi8-r"', function (done) {

            function eventListener() {
                var scriptElement = document.getElementsByTagName('script')[0];
                expect(scriptElement.src).to.be('https://example.ru/');
                expect(scriptElement.charset).to.be('koi8-r');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('https://example.ru/', 'koi8-r');
        });

        it('Should add script to the page with default encoding', function (done) {

            function eventListener() {
                var scriptElement = document.getElementsByTagName('script')[0];
                expect(scriptElement.src).to.be('https://example.com/');
                expect(scriptElement.charset).to.be('utf-8');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('https://example.com/');
        });

        it('Should add script to the page with сyrillic', function (done) {

            function eventListener() {
                var firstScriptElement = document.getElementsByTagName('script')[0];
                expect(firstScriptElement.src).to.be('http://xn--d1acpjx3f.xn--p1ai/');
                expect(firstScriptElement.charset).to.be('utf-8');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(firstScriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('http://яндекс.рф/');
        });

        it('Should add script to the page with parameters', function (done) {

            function eventListener() {
                var scriptElement = document.getElementsByTagName('script')[0];
                expect(scriptElement.src).to.be('http://example.net/scripts/browser.js?mode=debug');
                expect(scriptElement.charset).to.be('utf-8');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('http://example.net/scripts/browser.js?mode=debug');
        });

        it('Should add script to the page with the relative path', function (done) {

            function eventListener() {
                var pathname = document.location.pathname,
                    origin = document.location.origin,
                    // Вырезаем название файла в конце.
                    subPathname = pathname.substring(0, pathname.length - 10),
                    scriptElement = document.getElementsByTagName('script')[0];
                expect(scriptElement.src).to.be(origin + subPathname + 'script.js');
                expect(scriptElement.charset).to.be('utf-8');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('script.js');
        });

        it('Should be added / at the end', function (done) {

            function eventListener() {
                var scriptElement = document.getElementsByTagName('script')[0];
                expect(scriptElement.src).to.be('https://example.net/');

                headElement.removeEventListener('DOMNodeInserted', eventListener);
                headElement.removeChild(scriptElement);
                done();
            }
            headElement.addEventListener('DOMNodeInserted', eventListener);
            utilScript.create('https://example.net');
        }, this);
    });

    provide({});
});