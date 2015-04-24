ym.modules.define('util.defineClass', ['util.extend'], function (provide, extend) {
    function augment (childClass, parentClass, override) {
        childClass.prototype = (Object.create || function (obj) {
            function F () {}

            F.prototype = obj;
            return new F();
        })(parentClass.prototype);

        childClass.prototype.constructor = childClass;
        childClass.superclass = parentClass.prototype;
        childClass.superclass.constructor = parentClass;

        if (override) {
            extend(childClass.prototype, override);
        }

        return childClass.prototype;
    }

    function createClass (childClass, parentClass, override) {
        var baseClassProvided = typeof parentClass == 'function';

        if (baseClassProvided) {
            augment(childClass, parentClass);
        }

        for (var i = baseClassProvided ? 2 : 1, l = arguments.length; i < l; i++) {
            extend(childClass.prototype, arguments[i]);
        }

        return childClass;
    }

    provide(createClass);
});