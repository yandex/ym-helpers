ym.modules.define('test.system.mergeImports', [
    'system.mergeImports'
], function (provide, mergeImports) {

    describe('test.system.mergeImports', function () {

        it('isPackage() should work', function () {
            expect(mergeImports.isPackage('package.pack')).to.be(true);
            expect(mergeImports.isPackage('pack.package')).to.be(false);
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'a.b.c',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return undefined', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'b.c',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be(undefined);
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b'},
                path = 'a.b.c',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = '.a.b.c',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b'},
                path = '',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {},
                path = 'a.b.c',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = '.',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'b',
                data = 'data';
            expect(mergeImports.createNS(parentNs, path, data)).to.be('data');
        });

        it('joinImports() should ignore identical modules', function () {
            ym.modules.define('a', ['b', 'c'], function (provide, b, c) {
                provide('a' + b + c)
            });
            ym.modules.define('b', ['c'], function (provide, c) {
                provide('b' + c)
            });
            ym.modules.define('c', function (provide) {
                provide('c')
            });
            expect(mergeImports.joinImports('package.', {}, ['a', 'a', 'b', 'b', 'c'],['','','','',''])).to.eql({'a':'',
                'b':'','c':'','__package':[['a',''],['b',''],['c','']]});
        });
    });
    provide({});
});