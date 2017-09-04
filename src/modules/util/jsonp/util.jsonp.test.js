ym.modules.define('test.util.jsonp', [
    'util.jsonp'
], function (provide, jsonp) {

    describe('test.util.jsonp', function () {
        var urlForCheck = 'https://api-maps.yandex.ru/services/coverage/v2/?l=map&ll=37.62039300,55.75396000&z=0&lang=ru_RU';

        it('Adds a random number as a parameter when noCache = true', function () {
            jsonp({
                url: urlForCheck,
                noCache: true,
                postprocessUrl: function (firstUrl) {
                    jsonp({
                        url: urlForCheck,
                        noCache: true,
                        postprocessUrl: function (secondUrl) {
                            expect(firstUrl).not.to.be(secondUrl);
                            expect(firstUrl.indexOf('&_=')).not.to.be(-1);
                        }
                    });
                }
            });
        });

        it('Makes identical requests without a random number when noCache = true', function () {
            jsonp({
                url: urlForCheck,
                noCache: false,
                padding: 'name',
                postprocessUrl: function (firstUrl) {
                    jsonp({
                        url: urlForCheck,
                        noCache: false,
                        padding: 'name',
                        postprocessUrl: function (secondUrl) {
                            expect(firstUrl).to.be(secondUrl);
                            expect(firstUrl.indexOf('&_=')).to.be(-1);
                        }
                    });
                }
            });
        });

        it('Check paramName и padding', function () {
            jsonp({
                url: urlForCheck,
                noCache: false,
                paramName: 'nameParamName',
                padding: 'name',
                postprocessUrl: function (url) {
                    expect(url).to.be(urlForCheck + '&nameParamName=name');
                }
            });
        });

        it('Check paddingKey', function () {
            jsonp({
                url: urlForCheck,
                noCache: false,
                paddingKey: 'name2',
                postprocessUrl: function (url) {
                    expect(url).to.be(urlForCheck + '&callback=name2');
                }
            });
        });

        it('When added paddingKey and padding we should use padding', function () {
            jsonp({
                url: urlForCheck,
                noCache: false,
                paddingKey: 'name2',
                padding: 'name',
                postprocessUrl: function (url) {
                    expect(url).to.be(urlForCheck + '&callback=name');
                }
            });
        });

        it('If you set timeout: 30, the script does not have time to load and throw an error', function (done) {
            jsonp({
                url: urlForCheck,
                noCache: false,
                timeout: 30
            }).then(function (data) {
            }, function (error) {
                expect(error.message).to.be('timeoutExceeded');
                done();
            }, this);
        });

        it('If you set timeout: 5000, the method should work fine', function (done) {
            jsonp({
                url: urlForCheck,
                noCache: false,
                timeout: 5000
            }).then(function () {
                done();
            }, function (error) {
            }, this);
        });

        it('Form the URL using requestParams', function () {
            jsonp({
                url: 'https://api-maps.yandex.ru/services/coverage/v2/?',
                noCache: false,
                requestParams: {
                    l: 'map',
                    ll: [37.62039300, 55.75396000],
                    z: 0,
                    lang: 'ru_RU'
                },
                padding: 'name',
                postprocessUrl: function (url) {
                    expect(url).to.be('https://api-maps.yandex.ru/services/coverage/v2/?&callback=name&l=map&ll=37.620393%2C55.75396&z=0&lang=ru_RU');
                }
            });
        });

        it('Form the URL using postprocessUrl', function (done) {
            jsonp({
                url: 'https://api-maps.yandex.ru/services/coverage/v2/?',
                noCache: false,
                postprocessUrl: function (url) {
                    return url + '&l=map&ll=37.62039300,55.75396000&z=0&lang=ru_RU'
                }
            }).then(function (res) {
                expect(res.status).to.be('success');
                expect(res.data[0].id).to.be('map');
                done();
            });
        });
    });
    provide({});
});