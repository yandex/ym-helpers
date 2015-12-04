ym.modules.define('system.supports.css', [], function (provide) {
    var testDiv,
        transitableProperties = {
            'transform': 'transform',
            'opacity': 'opacity',
            'transitionTimingFunction': 'transition-timing-function',
            //TODO - нет никакой реакции на эти значения
            'userSelect': 'user-select',
            'height': 'height'
        },
        transitionPropertiesCache = {},
        cssPropertiesCache = {},
        browser = ym.env.browser,
        browserPrefix = browser.cssPrefix.toLowerCase();

    function checkCssProperty (name) {
        return typeof cssPropertiesCache[name] == 'undefined' ?
            cssPropertiesCache[name] = checkDivStyle(name) :
            cssPropertiesCache[name];
    }


    function checkDivStyle (name) {
        return checkTestDiv(name) || //names
               checkTestDiv(browserPrefix + upperCaseFirst(name)) || //mozNames
               checkTestDiv(browser.cssPrefix + upperCaseFirst(name)); //MozNames
    }

    function checkTestDiv (name) {
        return typeof getTestDiv().style[name] != 'undefined' ? name : null;
    }

    function getTestDiv () {
        return testDiv || (testDiv = document.createElement('div'));
    }

    function upperCaseFirst (str) {
        return str ? str.substr(0, 1).toUpperCase() + str.substr(1) : str;
    }

    function checkCssTransitionProperty (name) {
        var cssProperty = checkCssProperty(name);
        if (cssProperty && cssProperty != name) {
            cssProperty = '-' + browserPrefix + '-' + name;
        }
        return cssProperty;
    }

    function checkTransitionAvailability (name) {
        if (transitableProperties[name] && checkCssProperty('transitionProperty')) {
            return checkCssTransitionProperty(transitableProperties[name]);
        }
        return null;
    }

    provide({
        checkProperty: checkCssProperty,

        checkTransitionProperty: function (name) {
            return typeof transitionPropertiesCache[name] == 'undefined' ?
                transitionPropertiesCache[name] = checkTransitionAvailability(name) :
                transitionPropertiesCache[name];
        },

        checkTransitionAvailability: checkTransitionAvailability
    });
});