ym.modules.define('system.supports.csp', [], function (provide) {
    // Нельзя явно определить, поддерживается ли в браузере CSP.
    // Поэтому проверяем косвенно по наличию объекта Blob (для старых IE) и URL (для Opera 12).
    provide({
        isSupported: (typeof Blob != 'undefined') && (typeof URL != 'undefined')
    });
});
