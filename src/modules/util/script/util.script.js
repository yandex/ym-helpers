ym.modules.define("util.script", [], function (provide) {
    var head = document.getElementsByTagName("head")[0];
    provide({
        create: function (url, charset) {
            var tag = document.createElement('script');
            // кодировку выставляем прежде src, дабы если файл берется из кеша, он брался не в кодировке страницы
            // эта подобная проблема наблюдалась во всех IE до текущей (восьмой)
            tag.charset = charset || 'utf-8';
            tag.src = url;
            // т.к. head на данный момент может быть не закрыт, добавляем через insertBefore.
            // так как файл может быть взят из кеша и выполнение начнется в тот же момент - timeout
            setTimeout(function () {
                head.insertBefore(tag, head.firstChild);
            }, 0);
            return tag;
        }
    });
});