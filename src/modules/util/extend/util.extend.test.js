ym.modules.define('test.util.extend', [
    'util.extend'
], function (provide, utilExtend) {

    describe('test.util.extend', function () {

        it('Should copy the properties from two JavaScript objects to the passed JavaScript object', function () {

            var options = utilExtend({prop1: 'a', prop2: 'b'}, {prop2: 'c', prop3: 'd'}, {prop3: 'e'}),
                result = {prop1: 'a', prop2: 'c', prop3: 'e'};

            expect(options).to.eql(result);
        });

        it('Should copy the properties from three JavaScript objects to the passed empty JavaScript object', function () {

            var options = utilExtend({}, {prop1: 'a', prop2: 'b'}, {prop2: 'c', prop3: 'd'}, {prop3: 'e'}),
                func = utilExtend({}, {
                    prop: function () {
                        return 'result'
                    }
                }),
                result = {prop1: 'a', prop2: 'c', prop3: 'e'};

            expect(options).to.eql(result);
            expect(func.prop()).to.be('result');
        });

        it('Сheck different types of data', function () {

            var a = {a: 'a', b: {o: 0}, c: [1, 2], d: 2},
                b = {a: true, c: null, f: [0, 0]},
                c = {d: 'D', e: undefined, f: [-1, 1], j: 0},
                result = {a: true, b: {o: 0}, c: null, d: 'D', e: undefined, f: [-1, 1], j: 0};

            expect(utilExtend(a, b, c)).to.eql(result);
        })
    });

    provide({});
});