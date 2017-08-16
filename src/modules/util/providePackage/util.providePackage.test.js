ym.modules.define('test.util.providePackage', function (provide) {

    describe('test.util.providePackage', function () {

        it('Should provide package.', function (done) {
            ym.modules.define('package.example', ['util.providePackage', 'util.id', 'util.extend'], function (provide, providePackage) {
                providePackage(this, arguments);
            });
            ym.modules.require(['package.example'], function (ns) {

                var options = ns.util.extend({prop1: 'a', prop2: 'b'}, {prop2: 'c', prop3: 'd'}, {prop3: 'e'}),
                    result = {prop1: 'a', prop2: 'c', prop3: 'e'};

                expect(ns.util.id.gen()).to.be.a('string');
                expect(options).to.eql(result);
                done();
            });
        })
    });

    provide({});
});