ym.modules.define('system.supports.graphics', [], function (provide) {

    var WEBGL_CONTEXT_NAME = false,
        glContextSettings = {
            failIfMajorPerformanceCaveat: true, // just to be sure
            antialias: false                    // Firefox does not like offscreen canvas with AA
        },
        tests = {};

    function getWebglContextName (activeTest) {
        if (activeTest || WEBGL_CONTEXT_NAME === false && !!window.WebGLRenderingContext) {
            try {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("webgl", glContextSettings);
                if (context && typeof context.getParameter == "function") {
                    WEBGL_CONTEXT_NAME = 'webgl';
                } else {
                    context = canvas.getContext("experimental-webgl", glContextSettings); // IE
                    if (context && typeof context.getParameter == "function") {
                        WEBGL_CONTEXT_NAME = 'experimental-webgl';
                    } else {
                        WEBGL_CONTEXT_NAME = null;
                    }
                }
                if (context) { // force lose and cleanup context
                    var lose = context.getExtension('WEBGL_lose_context');
                    lose && lose.loseContext();
                }
            } catch (e) {
                // suppress warnings at FF
                WEBGL_CONTEXT_NAME = null;
            }
        }
        return WEBGL_CONTEXT_NAME;
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

        hasWebgl: function () {
            if (!window.WebGLRenderingContext || this.isWebglBlacklisted()) {
                return false;
            }
            if (!('webgl' in tests)) {
                var contextName = getWebglContextName(true);
                tests.webgl = contextName != 'disabled'
            }
            return tests.webgl;
        },

        hasVml: function () {
            if (!('vml' in tests)) {
                var supported = false;
                var topElement = document.createElement('div');
                topElement.innerHTML = '<v:shape id="yamaps_testVML"  adj="1" />';
                var testElement = topElement.firstChild;
                if (testElement && testElement.style) {
                    testElement.style.behavior = 'url(#default#VML)';
                    supported = testElement ? typeof testElement.adj == 'object' : true;
                    topElement.removeChild(testElement);
                }
                tests.vml = supported;
            }
            return tests.vml;
        },

        isWebglBlacklisted: function () {
            var browser = ym.env.browser,
                webglBrowserBlacklist = {
                    'Samsung Internet': true, // unstable
                    'AndroidBrowser': true    // unstable
                }, isOldAndroid = browser.engine == "Webkit" && (+browser.engineVersion < +537), // unstable
                isOldOperatingSystem = !/^Windows (XP|Vista|Server 2003)/.test(browser.osName); // deprecated

            return !!(isOldAndroid || isOldOperatingSystem || webglBrowserBlacklist[browser.name]);
        },

        redetect: function () {
            tests = {};
        },

        getWebglContextName: getWebglContextName
    });
});