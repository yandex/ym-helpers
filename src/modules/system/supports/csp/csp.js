ym.modules.define('system.supports.csp', [], function (provide) {
    // Нельзя явно определить, поддерживается ли в браузере CSP.
    // Поэтому проверяем косвенно по наличию объекта Blob (для старых IE) и URL (для Opera 12).
    // TODO: убрать проверки после MAPSAPI-12836
    var browser = ym.env ? ym.env.browser : null;
    provide({
        isSupported: (typeof Blob != 'undefined') && (typeof URL != 'undefined'),
        isNonceSupported: browser && browser.name && browser.version ?
            !(browser.name.search('Safari') != -1 && parseInt(browser.version) < 10) :
            null
    });
});
