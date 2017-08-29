ym.modules.define('test.createNs', [
    'system.createNs'
], function (provide, systemCreateNs) {

    describe('test.system.createNs', function () {

        it('Should change the value of the parentNs if the complex path exists', function () {
            var parentNs = {a: {b: {c: 'c'}}},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({a: {b: {c: 'data'}}});
            expect(path).to.be('a.b.c');
            expect(data).to.be('data');
        });

        it('Should leave the variables unchanged unless a complex path is found', function () {
            var parentNs = {a: 'a', b: 'b', c: 'c'},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'b', 'c': 'c'});
            expect(path).to.be('a.b.c');
            expect(data).to.be('data');
        });

        it('Should return undefined', function () {
            var parentNs = {a: 'a', b: 'b', c: 'c'},
                path = 'b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be(undefined);
            expect(parentNs).to.eql({'a': 'a', 'b': 'b', 'c': 'c'});
            expect(path).to.be('b.c');
            expect(data).to.be('data');
        });

        it('Should return data', function () {
            var parentNs = {a: 'a', b: 'b'},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'b'});
            expect(path).to.be('a.b.c');
            expect(data).to.be('data');
        });

        it('Should leave the variables unchanged and save a dot', function () {
            var parentNs = {a: 'a', b: 'b', c: 'c'},
                path = '.a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'b', 'c': 'c'});
            expect(path).to.be('.a.b.c');
            expect(data).to.be('data');
        });

        it('Should not return an error when path empty', function () {
            var parentNs = {a: 'a', b: 'b'},
                path = '',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'b'});
            expect(path).to.be('');
            expect(data).to.be('data');
        });

        it('Should create a path if parentNs empty', function () {
            var parentNs = {},
                path = 'a.b.c',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': {'b': {'c': 'data'}}});
            expect(path).to.be('a.b.c');
            expect(data).to.be('data');
        });

        it('Should save the data value in parentNs when "path = ."', function () {
            var parentNs = {a: 'a', b: 'b', c: 'c'},
                path = '.',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'b', 'c': 'c', '': 'data'});
            expect(path).to.be('.');
            expect(data).to.be('data');
        });

        it('Should change the value of the parentNs if the simple path exists', function () {
            var parentNs = {a: 'a', b: 'b', c: 'c'},
                path = 'b',
                data = 'data';
            expect(systemCreateNs(parentNs, path, data)).to.be('data');
            expect(parentNs).to.eql({'a': 'a', 'b': 'data', 'c': 'c'});
            expect(path).to.be('b');
            expect(data).to.be('data');
        });
    });

    provide({});
});