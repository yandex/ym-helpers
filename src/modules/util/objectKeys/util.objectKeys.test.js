ym.modules.define('test.util.objectKeys', [
    'util.objectKeys'
], function (provide, utilObjectKeys) {

    describe('test.util.objectKeys', function () {
        var keys = Object.keys;

        afterEach(function(){
            Object.keys = keys;
        });

        it('Should return the names of the enumerable properties and methods of an object with property which isn\'t enumerable.', function () {

            var obj = Object.create({}, { getFoo: { value: function() { return this.foo; } } });
            obj.foo = 1;
            expect(utilObjectKeys(obj)).to.eql(['foo']);
        });

        it('Should return the names of the enumerable properties and methods of an object with property which isn\'t enumerable if "typeof Object.keys != function".', function () {

            Object.keys = 'notFunction';

            var obj = Object.create({}, { getFoo: { value: function() { return this.foo; } } });
            obj.foo = 1;
            var result = utilObjectKeys(obj);

            Object.keys = keys;
            expect(result).to.eql(['foo']);
        });

        it('If the value supplied for the object argument is not the name of an object, a TypeError exception is thrown.', function () {

            var obj = 'notObject';
            try{
                expect(function () {
                    utilObjectKeys(obj);
                }).to.throwError();
            } catch(e){
                expect(e.message).to.be('Object.keys called on non-object');
                expect(e.name).to.be('TypeError');
            }
        });

        it('Should return the names of the enumerable properties and methods of an function.', function () {

            //TODO: написать юнит на функцию
        });
        it('Should return an array of a given array like object.', function () {

            var obj = { 0: 'a', 1: 'b', 2: 'c' };
            expect(utilObjectKeys(obj)).to.eql(['0', '1', '2']);
        });
        it('Should return an array of a given array like object with random key ordering.', function () {

            var obj = { 100: 'a', 2: 'b', 7: 'c' };
            expect(utilObjectKeys(obj)).to.eql(['100', '2', '7']);
        });

        it('Должны обработать null', function () {

            var obj = null;
            try{
                expect(function () {
                    utilObjectKeys(obj);
                }).to.throwError();
            } catch(e){
                expect(e.message).to.be('Object.keys called on non-object');
                expect(e.name).to.be('TypeError');
            }
        });
    });

    provide({});
});