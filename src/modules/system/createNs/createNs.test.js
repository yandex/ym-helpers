ym.modules.define('test.createNs', [
    'system.createNs'
], function (provide, systemCreateNs) {

    describe('test.system.createNs', function () {

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return undefined', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be(undefined);
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b'},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = '.a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b'},
                path = '',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = '.',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a:'a', b:'b', c:'c'},
                path = 'b',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
        });
    });

    provide({});
});