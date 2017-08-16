ym.modules.define('test.util.querystring', [
    'util.querystring'
], function (provide, querystring) {

    describe('test.querystring', function () {

        it('Should parse query string and stringify query params with default parameters', function () {

            var string = 'll=30.196078%2C59.898680&z=12&mode=routes&rtext=59.933589%2C30.393832~59.877717%2C30.315898&rtt=auto',
                params = { ll: '30.196078,59.898680',
                    z: '12',
                    mode: 'routes',
                    rtext: '59.933589,30.393832~59.877717,30.315898',
                    rtt: 'auto' };

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params with param-param delimiter = "*"', function () {

            var string = 'll=30.196078%2C59.898680*z=12*mode=routes*rtext=59.933589%2C30.393832~59.877717%2C30.315898*rtt=auto',
                params = { ll: '30.196078,59.898680',
                    z: '12',
                    mode: 'routes',
                    rtext: '59.933589,30.393832~59.877717,30.315898',
                    rtt: 'auto' };

            expect(querystring.parse(string, '*')).to.eql(params);
            expect(querystring.stringify(params, '*')).to.be(string);
        });

        it('Should parse query string and stringify query params with name-value delimiter = "=="', function () {

            var string = 'll==30.196078%2C59.898680&z==12&mode==routes&rtext==59.933589%2C30.393832~59.877717%2C30.315898&rtt==auto',
                params = { ll: '30.196078,59.898680',
                    z: '12',
                    mode: 'routes',
                    rtext: '59.933589,30.393832~59.877717,30.315898',
                    rtt: 'auto' };

            expect(querystring.parse(string, undefined, '==')).to.eql(params);
            expect(querystring.stringify(params, undefined, '==')).to.be(string);
        });

        it('Should parse query string with options.decodeURIComponent and options.encodeURIComponent', function () {
            var string = 'll=center&z=12&mode=routes&rtext=59.933589%2c30.393832~59.877717%230.315898&rtt=auto',
                params = { LL: 'CENTER',
                    Z: '12',
                    MODE: 'ROUTES',
                    RTEXT: '59.933589%2C30.393832~59.877717%230.315898',
                    RTT: 'AUTO'},
                decodeURIComponent = function(string){
                    return string.toUpperCase()
                },
                encodeURIComponent = function(string){
                    return string.toLowerCase()
                };

            expect(querystring.parse(string, undefined, undefined, {decodeURIComponent: decodeURIComponent})).to.eql(params);
            expect(querystring.stringify(params, undefined, undefined, {encodeURIComponent: encodeURIComponent})).to.be(string);
        });

        it('Should stringify query params with joinArrays = true', function () {

            var string = 'll=30.196078%2C59.898680&z=12&mode=routes&rtext=59.933589%2C30.393832%2C59.877717%2C30.315898&rtt=auto',
                params = { ll: '30.196078,59.898680',
                    z: '12',
                    mode: 'routes',
                    rtext: [[59.933589, 30.393832],[59.877717, 30.315898]],
                    rtt: 'auto' };

            expect(querystring.stringify(params, undefined, undefined, {joinArrays: true})).to.be(string);
        });

        it('Should parse query string and stringify query params consisting of one pair parameter = value', function () {

            var string = 'll=30.196078%2C59.898680',
                params = { ll: '30.196078,59.898680'};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse empty query string and stringify query params consisting of zero pairs parameter = value', function () {

            var string = '',
                params = {};
            //TODO: непонятно должно ли пустое значение парсится как {"": ""}, в таком случае оно не востановится до пустой строки при stringify
            //expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params consisting of only name of parameter or value', function () {

            var string = 'll=&=30.196078%2C59.898680',
                params = {
                    ll: '',
                    '': '30.196078,59.898680'};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params consisting of parameters with the same names', function () {

            var string = 'll=30.196078%2C59.898680&ll=59.898680%2C30.196078',
                params = {ll: ['30.196078,59.898680', '59.898680,30.196078']};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params consisting of null, undefined', function () {

            var string = 'null=null&undefined=undefined',
                params = {null: 'null', undefined: 'undefined'};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params сontaining spaces', function () {
            //TODO: нормально ли то что все пробелы сохраняются?
            var string = ' l l = 30.196078 %2C59.898680 ',
                params = { ' l l ': ' 30.196078 ,59.898680 '},
                result = '%20l%20l%20=%2030.196078%20%2C59.898680%20';

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(result);
        });

        it('Should parse query string and stringify query params сontaining сyrillic', function () {

            var string = '%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81=%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81',
                params = { яндекс: 'яндекс'};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

        it('Should parse query string and stringify query params сontaining special characters', function () {

            var string = '!%40%23%24%25%CB%86*())_%2B1234567890-%3D%3C%3E%3F%2C.%2F%3A%3B%22%22%5B%5D%7B%7D%7C%C2' +
                '%A7%C2%B1%D0%81%D1%91%2F=!%40%23%24%25%CB%86*())_%2B1234567890-%3D%3C%3E%3F%2C.%2F%3A%3B%5B%5D%7B' +
                '%7D%7C%C2%A7%C2%B1%D0%81%D1%91%2F',
                params = { '!@#$%ˆ*())_+1234567890-=<>?,./:;""[]{}|§±Ёё/': '!@#$%ˆ*())_+1234567890-=<>?,./:;[]{}|§±Ёё/'};

            expect(querystring.parse(string)).to.eql(params);
            expect(querystring.stringify(params)).to.be(string);
        });

    });
    provide({});
});