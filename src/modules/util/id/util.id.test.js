ym.modules.define('test.util.id', [
    'util.id'
], function (provide, utilId) {

    describe('test.util.id', function () {
        var prefix = utilId.prefix(),
            gen = utilId.gen();

        it('gen() should generate incremented random numbers', function () {

            expect(gen).to.be((utilId.gen() - 1).toString());
            expect(utilId.gen()).to.be((utilId.gen() - 1).toString());
        });

        it('prefix() should return the same prefix for each launch', function () {

            expect(utilId.prefix()).to.be(prefix);
            expect(utilId.prefix()).to.match(/^id_\d+/);
        });

        it('get() should generate id and assigns it to the id property of the passed object. ' +
            'If the object\'s id property exists, then the value of this property does not change.', function () {
            var obj = {a: 1},
                gen = utilId.gen();

            expect(utilId.get(window)).to.be(prefix);
            expect(utilId.get(obj) - 1).to.eql(gen);
            expect(utilId.get(obj)).to.eql(obj[prefix]);
        });
    });

    provide({});
});