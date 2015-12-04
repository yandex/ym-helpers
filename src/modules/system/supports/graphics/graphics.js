ym.modules.define('system.supports.graphics', [], function (provide) {

    var WEBGL_CONTEXT_NAME = null,
        glContextSettings = {
            failIfMajorPerformanceCaveat: true // TODO: работа этого флага до конца не понятно
        },
        tests = {};

    function getWebglContextName () {
        if (!WEBGL_CONTEXT_NAME && !!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("webgl", glContextSettings);
            if (context && typeof context.getParameter == "function") {
                WEBGL_CONTEXT_NAME = 'webgl';
            } else {
                context = canvas.getContext("experimental-webgl", glContextSettings); // IE
                if (context && typeof context.getParameter == "function") {
                    WEBGL_CONTEXT_NAME = 'experimental-webgl';
                }
            }
        }
        return WEBGL_CONTEXT_NAME;
    }

    function testCanvas(sandbox, ctx){
        sandbox.width=226;
        sandbox.height=256;

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 150, 150);

        ctx.globalCompositeOperation = "xor";

        ctx.fillStyle = "#f00";
        ctx.fillRect(10, 10, 100, 100);

        ctx.fillStyle = "#0f0";
        ctx.fillRect(50, 50, 100, 100);

        var data = ctx.getImageData(49, 49, 2, 2),
            test = [];
        for(var i=0;i<16;i++){
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
                //document.body.appendChild(sandbox);
            }
            return tests.canvas;
        },

        hasWebgl: function () {
            if (!window.WebGLRenderingContext) {
                return false;
            }
            // Кешировать поддержку WebGL нельзя. Он может выключиться на лету.
            // В общем случае обратно уже не включается.
            // TODO: рисовать плашку о падении WebGL, как это google maps делают.
            if (!('webgl' in tests) || tests['webgl']) {
                var sandbox = document.createElement("canvas"),
                    context = ('getContext' in sandbox) ? sandbox.getContext(getWebglContextName(), glContextSettings) : false;
                tests.webgl = context && typeof context.getParameter == "function";
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

        getWebglContextName: getWebglContextName
    });
});