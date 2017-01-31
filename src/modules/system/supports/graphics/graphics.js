ym.modules.define('system.supports.graphics', [], function (provide) {

    var webGlContextSettings = {
            failIfMajorPerformanceCaveat: true, // just to be sure
            antialias: false                    // Firefox does not like offscreen canvas with AA
        },
        tests = {};

    function isWebGlCapable () {
        // Test system support
        if (window.WebGLRenderingContext) {
            // test blacklists
            var browser = ym.env.browser,
                webglBrowserBlacklist = {
                    'Samsung Internet': true, // unstable
                    'AndroidBrowser': true    // unstable
                },
                isOldAndroid = browser.engine == "Webkit" && (+browser.engineVersion < +537); // unstable

            if (isOldAndroid || webglBrowserBlacklist[browser.name]) {
                return false;
            }
        } else {
            // No system support
            return false;
        }
        return true;
    }

    function detectWebGl () {
        if (!isWebGlCapable()) {
            return null;
        }

        var contextName;
        try {
            var canvas = document.createElement("canvas"),
                context = canvas.getContext(contextName = "webgl", webGlContextSettings);
            if (!context) {
                context = canvas.getContext(contextName = "experimental-webgl", webGlContextSettings); // IE
                if (!context) {
                    contextName = null;
                }
            }
        } catch (e) {
            // suppress warnings at FF
            contextName = null;
        }

        return contextName ? {
            contextName: contextName
        } : null;

    }

    // Test globalCompositeOperation to work properly
    function testCanvas (sandbox, ctx) {
        sandbox.width = 226;
        sandbox.height = 256;

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 150, 150);

        ctx.globalCompositeOperation = "xor";

        ctx.fillStyle = "#f00";
        ctx.fillRect(10, 10, 100, 100);

        ctx.fillStyle = "#0f0";
        ctx.fillRect(50, 50, 100, 100);

        var data = ctx.getImageData(49, 49, 2, 2),
            test = [];
        for (var i = 0; i < 16; i++) {
            test.push(data.data[i]);
        }
        return test.join('x') == '0x0x0x0x0x0x0x0x0x0x0x0x0x255x0x255';
    }

    provide({
        hasSvg: function () {
            if (!('svg' in tests)) {
                tests.svg = document.implementation &&
                    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
            }
            return tests.svg;
        },

        hasCanvas: function () {
            if (!('canvas' in tests)) {
                var sandbox = document.createElement('canvas'),
                    canvas = ('getContext' in sandbox) ? sandbox.getContext('2d') : null;
                tests.canvas = canvas ? testCanvas(sandbox, canvas) : false;
            }
            return tests.canvas;
        },

        hasWebGl: function () {
            if (!('webgl' in tests)) {
                tests.webgl = detectWebGl();
            }
            return tests.webgl;
        },

        hasVml: function () {
            if (!('vml' in tests)) {
                var supported = false,
                    topElement = document.createElement('div'),
                    testElement;
                topElement.innerHTML = '<v:shape id="yamaps_testVML"  adj="1" />';
                testElement = topElement.firstChild;
                if (testElement && testElement.style) {
                    testElement.style.behavior = 'url(#default#VML)';
                    supported = testElement ? typeof testElement.adj == 'object' : true;
                    topElement.removeChild(testElement);
                }
                tests.vml = supported;
            }
            return tests.vml;
        },

        redetect: function () {
            tests = {};
        },

        getWebGlContextName: function () {
            return tests.webgl && tests.webgl.contextName;
        }
    });
});
