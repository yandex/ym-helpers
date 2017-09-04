ym.modules.define('test.system.nextTick', [
    'system.nextTick'
], function (provide, nextTick) {

    describe('test.system.nextTick', function () {

        it('"nextTick" should be executed in the next tick', function (done) {
            var i = 0;
            nextTick(function(){
                i++;
                expect(i).to.be(1);
                done();
            });
            expect(i).to.be(0);
        });

        it('Functions should be executed in the same sequence how they were transmitted', function (done) {
            var i = 0;
            nextTick(function(){
                i++;
                expect(i).to.be(1);
            });
            nextTick(function(){
                i *= 2;
                expect(i).to.be(2);
            });
            nextTick(function(){
                i *= 2;
                expect(i).to.be(4);
                done();
            });
            expect(i).to.be(0);
        });
    });

    provide({});
});