ym.modules.define('test.error', [
    'error'
], function (provide, error) {

    describe('test.modules.error', function () {

        beforeEach(function(){
            ym.env.debug = true;
        });

        after(function(){
            ym.env.debug = false;
        });

        it('Should return all possible errors.', function () {

            var errors = ['_YMError', 'ClientError', 'InputError', 'StateError', 'ProcessError', 'StorageItemAccessError',
                'FeatureRemovedError', 'Warning', 'Reject', 'ExternalError', 'RequestError', 'DataProcessingError',
                'AccessError', 'NotSupportedError', 'OperationUnallowedReject', 'OperationCanceledReject', 'EmptyResultReject',
                'OperationUnavailableReject', 'DeprecationWarning', 'OveruseWarning'];

            for (var type in errors) {
                var errorObj = error.create(errors[type], 'customMessage');
                expect(errorObj.name).to.be(errors[type]);
                expect(errorObj.message).to.be('customMessage');
            }
        });

        it('Should throw an exception in mode `debug`.', function () {

            expect(function(){
                error.throwException('InputError', 'GeometryCollection can not hold geometry of type')
            }).to.throwError();

            try {
                error.throwException('InputError', 'GeometryCollection can not hold geometry of type');
            } catch(e){
                expect(e.name).to.be('InputError');
                expect(e.message).to.be('GeometryCollection can not hold geometry of type');
                expect(e.stack).to.not.be.empty();
            }
        });

        it('Should throw an exception in mode `debug`, If the condition is satisfied.', function () {

            expect(function(){
                error.throwExceptionIf(true, 'ClientError', 'GeometryCollection can not hold geometry of type')
            }).to.throwError();

            try {
                error.throwExceptionIf(true, 'ClientError', 'GeometryCollection can not hold geometry of type');
            } catch(e){
                expect(e.name).to.be('ClientError');
                expect(e.message).to.be('GeometryCollection can not hold geometry of type');
                expect(e.stack).to.not.be.empty();
            }
        });

        it('Shouldn\'t throw an exception in mode `release`.', function () {

            ym.env.debug = false;

            expect(function(){
                error.throwExceptionIf(true, 'ClientError', 'GeometryCollection can not hold geometry of type')
            }).to.not.throwError();

            expect(function(){
                error.throwException('InputError', 'GeometryCollection can not hold geometry of type')
            }).to.not.throwError();
        });
    });

    provide({});
});