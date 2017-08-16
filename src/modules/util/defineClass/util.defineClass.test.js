ym.modules.define('test.util.defineClass', [
    'util.defineClass'
], function (provide, defineClass) {

    describe('test.util.defineClass', function () {

        it('defineClass() should work', function () {
            var child = function (a, b) {
                    this._a = a;
                    this.b = b;
                },
                override = {
                    getC: function () {
                        return this._c + "c";
                    }
                },
                parent = {
                    setC: function (c) {
                        this._c = c;
                    },
                    getC: function () {
                        return this._c;
                    },
                    getOnlyC: function () {
                        return this._c;
                    }
                };
            defineClass(child, parent, override);

            var obj = new child(5, 6);
            obj.setC('c');

            expect(obj.getC()).to.be('cc');
            expect(obj.getOnlyC()).to.be('c');
            expect(obj.b).to.be(6);
            expect(obj._a).to.be(5);
        });

        it('Should return right superclass.', function () {
            var parent = function () {
                },
                child = function () {
                },
                override = {
                    setC: function (c) {
                        this._c = c;
                    },
                    getC: function () {
                        return this._c;
                    }
                };

            defineClass(child, parent, override);
            var obj = new child();
            obj.setC('c');

            expect(obj.getC()).to.be('c');
            expect(child.superclass == parent.prototype).to.be(true);
        });

        it('Modifying the prototype should affect a child.', function () {

            var parent = function () {
                },
                child = function () {
                };

            defineClass(child, parent);
            var instance = new child();
            parent.prototype.method = function () {
                return 42
            };

            expect(instance.method == parent.prototype.method).to.be(true);
        });

        it('Access to parent method.', function () {

            var parent = function (value) {
                    this.prop = value;
                };
            parent.prototype = {
                get: function () {
                    return this.prop;
                }
            };
            var child = function (val) {
                    child.superclass.constructor.call(this, val);
                };

            defineClass(child, parent);
            var instance = new child(42);

            expect(instance.get()).to.be(42);
        });

        it('Access to parent method.', function () {
            var grandParent = function (value) {
                    this.prop = value;
                };
            grandParent.prototype = {
                get: function () {
                    return this.prop;
                }
            };
            var parent = function (value) {
                    parent.superclass.constructor.call(this, value);
                };
            defineClass(parent, grandParent, {
                get: function () {
                    return parent.superclass.get.call(this) + 1;
                }
            });
            var child = function (val) {
                    child.superclass.constructor.call(this, val);
                };
            defineClass(child, parent);
            var instance = new child(42);

            expect(instance.get()).to.be(43);
        });
    });

    provide({});
});