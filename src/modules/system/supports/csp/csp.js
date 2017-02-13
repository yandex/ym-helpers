ym.modules.define('system.supports.csp', [], function (provide) {
    // Если Blob не определен, браузер слишком старый
    // и невозможно в полном объеме сделать все для поддержки csp.
    var canSupportCsp = (typeof Blob != 'undefined');
    provide(canSupportCsp);
});
