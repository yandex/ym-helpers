ym.modules.define('test.template.Parser', [
    'template.Parser'
], function (provide, Parser) {

    describe('Template', function () {
        var parser;

        function getKey(object, parts) {
            if (!(object instanceof Object)) {
                return;
            }

            var separator = '.',
                keys = [];

            if (typeof parts == "string") {
                if (parts.indexOf(separator) != -1) {
                    keys = parts.split(separator);
                } else {
                    return object[parts];
                }
            } else {
                keys = parts;
            }

            for (var i = 0, l = keys.length; i < l; i++) {
                if (object instanceof Object) {
                    object = object[keys[i]];
                } else {
                    return;
                }
            }

            return object;
        }

        var Storage = function () {
            this.hash = {};
        };
        Storage.prototype = {
            add: function (key, object) {
                this.hash[key] = object;
                return this;
            },
            get: function (key) {
                return typeof key == 'string' || (key instanceof String) ? this.hash[key] : key;
            },
            remove: function (key) {
                delete this.hash[key];
                return this;
            }
        };
        var filtersStorage = new Storage();
        filtersStorage.add('default', function (treeData, value, filterValue) {
            var resultValue = value;

            if (typeof value == 'undefined') {
                var word = filterValue,
                    firstSymbol = word.charAt(0);

                if (firstSymbol == "'" || firstSymbol == '"') {
                    word = word.slice(1, word.length - 1);
                    resultValue = word;
                } else {
                    if (!isNaN(word)) {
                        resultValue = word;
                    } else {
                        resultValue = treeData.get(filterValue);
                    }
                }
            }

            return resultValue;
        });

        before(function () {
            parser = new Parser(filtersStorage);
        });

        describe('Old template format', function () {

            it('If', function () {
                var text = 'a*[if b]$[yes][endif][if b == 3]-no$[c][else]-yes[endif]/[if whtsp=="what\'s up"&&true&&b]yes[else][endif][ifdef b][else]no[endif]',
                    build = parser.build(parser.parse(text), {
                        yes: 'yes',
                        b: true,
                        whtsp: "what's up",
                        c: false,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.equal('a*yes-yes/yes');
                expect(build.renderedValues).to.have.keys(['yes', 'b', 'whtsp']);
            });

            it('Nested ifs', function () {
                var text = '[if a]yes-[if b == "test" && 0 === null || 2 > 2e6]no[ifdef c]no[else][endif][endif][endif]',
                    build = parser.build(parser.parse(text), {
                        a: true,
                        b: 'test',
                        c: true,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('yes-');
                expect(build.renderedValues).to.have.keys(['a', 'b']);
                expect(build.renderedValues).not.to.have.key('c');
            });

            it('Sublayouts', function () {
                var text = '<ymaps>$[[options.contentLayout observeSize name = "balloonContent" maxWidth = options.maxWidth maxHeight = options.maxHeight minWidth = options.minWidth  minHeight = options.minHeight]]</ymaps>[if options.closeButton]$[[options.closeButtonLayout]][endif]',
                    build = parser.build(parser.parse(text), {
                        options: {
                            closeButton: true,
                            minHeight: 30
                        },
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });

                expect(build.sublayouts).to.have.length(2);
                expect(build.sublayouts[0].key).to.be('options.contentLayout');
                expect(build.sublayouts[1].key).to.be('options.closeButtonLayout');
                expect(build.sublayouts[0]).to.have.key('monitorValues');
                expect(build.sublayouts[0].monitorValues).to.have.length(4);
                expect(build.sublayouts[0]).to.have.key('observeSize');
                expect(build.sublayouts[0]).to.have.key('name');
                expect(build.sublayouts[0].name).to.be('balloonContent');
                expect(build.sublayouts[0]).to.have.key('minHeight');
                expect(build.sublayouts[0].minHeight).to.be(30);
            });

            it('Matching', function () {
                var text = '[if var1]trololo-$[[sub1]]-$[var2]-tro[l]olo-[else][endif]text[if var3]-$[var4|trololo]-test-$[[sub2]]$[[sub2]]-test[endif]test',
                    build = parser.build(parser.parse(text), {
                        var1: false,
                        var2: null,
                        var3: true,
                        var4: undefined,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.match(/text\-trololo\-test\-(.+)\-testtest/);
                expect(build.sublayouts).to.have.length(2);
                expect(build.sublayouts[0].key).to.be('sub2');
                expect(build.sublayouts[1].key).to.be('sub2');
                expect(build.renderedValues).to.have.keys(['var1', 'var3', 'var4']);
                expect(build.renderedValues).not.to.have.keys(['var2']);
            });
        });
        describe('New template format', function () {

            it('If', function () {
                var text = 'a*{% if  b %}{{ yes}}{% endif%}{%if b == 3%}-no{{c}}{%else%}-yes{% endif %}/{% if whtsp=="what\'s up"&&true&&b%}yes{%else %}{%endif%}{%if typeof e == "undefined"%}*yes{%else%}no{%endif%}',
                    build = parser.build(parser.parse(text), {
                        yes: 'yes',
                        b: true,
                        whtsp: "what's up",
                        c: false,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('a*yes-yes/yes*yes');
                expect(build.renderedValues).to.have.keys(['yes', 'b', 'whtsp']);
            });

            it('Calculations in if', function () {
                var text = '{% if (a + b) == 7 %}yes{% else %}no{% endif %}',
                    build = parser.build(parser.parse(text), {
                        a: 4,
                        b: 3,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('yes');
                expect(build.renderedValues).to.have.keys(['a', 'b']);
            });

            it('Access to the fields of object through the point', function () {
                var text = '{{ a.b.c.d }}',
                    build = parser.build(parser.parse(text), {
                        a: {
                            b: {
                                c: {
                                    d: '123'
                                }
                            }
                        },
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('123');
                expect(build.renderedValues).to.have.keys(['a', 'a.b', 'a.b.c', 'a.b.c.d']);
            });

            it('Access the elements in a "date" through brackets', function () {
                var text = '{{ testNum[0] }}{{ testNum[ 2  ] }}{{ testString["test"] }}{{ testString["tt"][0] }}',
                    build = parser.build(parser.parse(text), {
                        testNum: [5, 4, 3, 2, 1],
                        testString: {
                            test: "test",
                            tt: [1, 2, 3, 4]
                        },
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('53test1');
                expect(build.renderedValues).to.have.keys([
                    'testNum', 'testString', 'testNum.0', 'testNum.2',
                    'testString.test', 'testString.tt', 'testString.tt.0'
                ]);
            });

            it('Should work correctly in mixed constructions: parentheses + brackets when accessing data', function () {
                var text = '{{ users.0.name }}-{{ users[1]["name"] }}-{{ users.0.stat[0].num }}-{{ users[1].stat.0["num"] }}',
                    build = parser.build(parser.parse(text), {
                        users: [
                            {
                                name: "n1",
                                age: 30,
                                stat: [{num: 1}, 2, 3]
                            }, {
                                name: "n2",
                                age: 10,
                                stat: [{num: 4}, 5, 6]
                            }, {
                                name: "n3",
                                age: 24,
                                stat: [{num: 7}, 8, 9]
                            }
                        ],
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('n1-n2-1-4')
            });

            it('Standard value', function () {
                var text = '{{ value1|default:value2|raw }} {{ value2|default:value3|raw }} {{ value2|default:"111"|raw }} {{ value2|default:\'Zzz\'|raw }} {{ value4|default:234|raw }} {{ value4|default:-100.5123|raw }} {{ value4|default:\'0\'|raw }} {{ value4|default:0|raw }} +++',
                    build = parser.build(parser.parse(text), {
                        value1: "1",
                        value3: "123",
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be("1 123 111 Zzz 234 -100.5123 0 0 +++");
            });

            it('Nested ifs', function () {
                var text = '{% if a %}yes-{%if b == "test" && 0 === null || 2 > 2e6%}no{%if typeof c != "undefined" %}no{%else%}{%endif%}{%endif%}{%endif%}',
                    build = parser.build(parser.parse(text), {
                        a: true,
                        b: 'test',
                        c: true,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('yes-');
                expect(build.renderedValues).to.have.keys(['a', 'b']);
                expect(build.renderedValues).not.to.have.key('c');
            });

            it('Elseif conditions', function () {
                var text = '{% if a %}yes{% elseif b %}elseif_b{% elseif c  == "test"  %}elseif_c{% else %}no{% endif %}',
                    build = parser.build(parser.parse(text), {
                        a: false,
                        b: null,
                        c: 'test',
                        d: true,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('elseif_c');
                expect(build.renderedValues).to.have.keys(['a', 'b', 'c']);
                expect(build.renderedValues).not.to.have.key('d');
            });

            it('Elseif condition with nested if-elseif', function () {
                var text = '{% if a %}yes{% elseif !b %}' +
                        '{% if a %}depth_a{% elseif !a %}depth_elseif_a{% endif %}' +
                        '{% elseif c  == "test"  %}elseif_c' +
                        '{% else %}no{% endif %}',
                    build = parser.build(parser.parse(text), {
                        a: false,
                        b: null,
                        c: 'test',
                        d: true,
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.be('depth_elseif_a');
                expect(build.renderedValues).to.have.keys(['a', 'b']);
                expect(build.renderedValues).not.to.have.keys(['d', 'c']);
            });

            it('Matching', function () {
                var text = '{% if var1 %}trololo-{% include sub1 %}-{{var2}}-tro[l]olo-{%else%}{%endif%}text{% if var3 %}-{{var4|default:"trololo"}}-test-{% include sub2 %}{% include sub2 %}-test{% endif %}{{ test }}{{ test|raw }}{{ var4|default:test|raw }}',
                    build = parser.build(parser.parse(text), {
                        var1: false,
                        var2: null,
                        var3: true,
                        var4: undefined,
                        test: '<>\'"!',
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.text).to.match(/text\-trololo\-test\-(.+)\-test&lt;&gt;&#39;&quot;!<>'"!<>'"!/);
                expect(build.sublayouts).to.have.length(2);
                expect(build.sublayouts[0].key).to.be('sub2');
                expect(build.sublayouts[1].key).to.be('sub2');
                expect(build.renderedValues).to.have.keys(['var1', 'var3', 'var4']);
                expect(build.renderedValues).not.to.have.keys(['var2']);
            });

            it('Sublayout', function () {
                var text = '<ymaps>{% include options.contentLayout observeSize name = "balloonContent" maxWidth = options.maxWidth maxHeight = options.maxHeight minWidth = options.minWidth minHeight = options.minHeight%}</ymaps>{%if options.closeButton%}{%include options.closeButtonLayout%}{% endif %}',
                    build = parser.build(parser.parse(text), {
                        options: {
                            closeButton: true,
                            minHeight: 30
                        },
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                build.text = build.strings.join('');

                expect(build.sublayouts).to.have.length(2);
                expect(build.sublayouts[0].key).to.be('options.contentLayout');
                expect(build.sublayouts[1].key).to.be('options.closeButtonLayout');
                expect(build.sublayouts[0]).to.have.key('monitorValues');
                expect(build.sublayouts[0].monitorValues).to.have.length(4);
                expect(build.sublayouts[0]).to.have.key('observeSize');
                expect(build.sublayouts[0]).to.have.key('name');
                expect(build.sublayouts[0].name).to.be('balloonContent');
                expect(build.sublayouts[0]).to.have.key('minHeight');
                expect(build.sublayouts[0].minHeight).to.be(30);
            });

            describe('For', function () {

                it('A simple search through the elements of the array', function () {
                    var text = [
                            '{% for elem in elements %}',
                            '{{ elem }}!={{ someObj.first }},',
                            '{% endfor %}'
                        ].join(''),
                        build = parser.build(parser.parse(text), {
                            elements: ['1', '2', '3'],
                            someObj: {first: 'zzz'},
                            get: function (key) {
                                return getKey(this, key);
                            }
                        });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('1!=zzz,2!=zzz,3!=zzz,');
                    expect(build.renderedValues).to.have.keys(['elements', 'elements.0',
                        'elements.1', 'elements.2',
                        'someObj', 'someObj.first']);
                    expect(build.renderedValues['elements.0'].value).to.be('1');
                    expect(build.renderedValues['elements.1'].value).to.be('2');
                    expect(build.renderedValues['elements.2'].value).to.be('3');
                    expect(build.renderedValues['someObj.first'].value).to.be('zzz');
                });

                it('Getting key, value', function () {
                    var text = [
                            '{% for key, value in array %}',
                            '{{ key }}={{ value }},',
                            '{% endfor %}',
                            '_',
                            '{% for key, value in objects %}',
                            '{{title}}={{ key }}={{ value.sub_property }},',
                            '{% endfor %}'
                        ].join(''),
                        build = parser.build(parser.parse(text), {
                            array: ['aaa', 'bbb', 'ccc'],
                            objects: {
                                key1: {sub_property: 'value1'},
                                key2: {sub_property: 'value2'},
                                key3: {sub_property: 'value3'}
                            },
                            title: 'title',
                            get: function (key) {
                                return getKey(this, key);
                            }
                        });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('0=aaa,1=bbb,2=ccc,_title=key1=value1,title=key2=value2,title=key3=value3,');
                    expect(build.renderedValues).to.have.keys(['title',
                        'array', 'array.0', 'array.1',
                        'array.2',
                        'objects', 'objects.key1',
                        'objects.key2', 'objects.key3',
                        'objects.key1.sub_property',
                        'objects.key2.sub_property',
                        'objects.key3.sub_property']);

                    expect(build.renderedValues['title'].value).to.be('title');
                    expect(build.renderedValues['array.0'].value).to.be('aaa');
                    expect(build.renderedValues['array.1'].value).to.be('bbb');
                    expect(build.renderedValues['array.2'].value).to.be('ccc');
                    expect(build.renderedValues['objects.key1.sub_property'].value).to.be('value1');
                    expect(build.renderedValues['objects.key2.sub_property'].value).to.be('value2');
                    expect(build.renderedValues['objects.key3.sub_property'].value).to.be('value3');
                });

                it('Nested array', function () {
                    var text = [
                            '{% for value in array %}',
                            '{% for subValue in value %}',
                            '{{ subValue }}={{ title }},',
                            '{% endfor %}',
                            '_',
                            '{% for value in objects %}',
                            '{{ value.subkey.subsubkey }},',
                            '{% endfor %}',
                            '{% endfor %}'
                        ].join(''),
                        build = parser.build(parser.parse(text), {
                            array: [
                                [1, 2],
                                [3, 4]
                            ],
                            objects: {
                                key1: {subkey: {subsubkey: "111"}},
                                key2: {subkey: {subsubkey: "222"}}
                            },
                            title: 'ZzZ',
                            get: function (key) {
                                return getKey(this, key);
                            }
                        });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('1=ZzZ,2=ZzZ,_111,222,3=ZzZ,4=ZzZ,_111,222,');
                    expect(build.renderedValues).to.have.keys(
                        ['title',
                            'array', 'array.0', 'array.1', 'array.0.0', 'array.0.1', 'array.1.0',
                            'array.1.1',
                            'objects', 'objects.key1', 'objects.key2', 'objects.key1.subkey',
                            'objects.key2.subkey', 'objects.key1.subkey.subsubkey',
                            'objects.key2.subkey.subsubkey'
                        ]);

                    expect(build.renderedValues['title'].value).to.be('ZzZ');
                    expect(build.renderedValues['array.0.0'].value).to.be(1);
                    expect(build.renderedValues['array.0.1'].value).to.be(2);
                    expect(build.renderedValues['array.1.0'].value).to.be(3);
                    expect(build.renderedValues['array.1.1'].value).to.be(4);

                    expect(build.renderedValues['objects.key1.subkey.subsubkey'].value).to.be('111');
                    expect(build.renderedValues['objects.key2.subkey.subsubkey'].value).to.be('222');
                });

            });

            describe('empty', function () {

                var data;

                before(function () {
                    data = {
                        data: {
                            title: '123',
                            bb: true,
                            elements: [1, 2, 3],
                            elements3: []
                        },
                        get: function (key) {
                            return getKey(this, key);
                        }
                    };
                });

                it('Substitution by key', function () {
                    var build = parser.build(parser.parse('{{ data.title }}'), data);

                    expect(build.empty).to.be(false);
                });

                it('Substitution by non-existent key', function () {
                    var build = parser.build(parser.parse('{{ data.title2 }}'), data);

                    expect(build.empty).to.be(true);
                });

                it('Simple text', function () {
                    var build = parser.build(parser.parse('12фывфыв3'), data);

                    expect(build.empty).to.be(false);
                });

                it('Empty string', function () {
                    var build = parser.build(parser.parse(''), data);

                    expect(build.empty).to.be(true);
                });

                it('Space', function () {
                    var build = parser.build(parser.parse(' '), data);

                    expect(build.empty).to.be(false); // TODO?
                });

                it('Positive condition', function () {
                    var build = parser.build(parser.parse('{% if data.bb %}{{ data.title }}{% endif %}'), data);

                    expect(build.empty).to.be(false);
                });

                it('Negative condition', function () {
                    var build = parser.build(parser.parse('{% if data.cc %}123{% endif %}'), data);

                    expect(build.empty).to.be(true);
                });

                it('Standard value by key', function () {
                    var build = parser.build(parser.parse('{{ data.title2|default:data.title }}'), data);

                    expect(build.empty).to.be(false);
                });

                it('Standard value - text', function () {
                    var build = parser.build(parser.parse('{{ data.title2|default:"123" }}'), data);

                    expect(build.empty).to.be(false);
                });

                it('Simple loop', function () {
                    var build = parser.build(parser.parse('{% for element in data.elements %}element{% endfor %}'), data);

                    expect(build.empty).to.be(false);
                });

                it('Non-existing loop', function () {
                    var build = parser.build(parser.parse('{% for element in data.elements2 %}element{% endfor %}'), data);

                    expect(build.empty).to.be(true);
                });

                it('Empty array', function () {
                    var build = parser.build(parser.parse('{% for element in data.elements3 %}element{% endfor %}'), data);

                    expect(build.empty).to.be(true);
                });
            });

            describe('Filters', function () {
                it('Filter raw', function () {
                    var build = parser.build(parser.parse('{{ title|raw }}'), {
                        title: '<h1>!</h1>',
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('<h1>!</h1>');
                });

                it('Filter default', function () {
                    var build = parser.build(parser.parse('{{ title|default:"<h1>!</h1>"|raw }}'), {
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('<h1>!</h1>');
                });

                it('Custom filters', function () {
                    var formatDate = function (data, value, filterValue) {
                        var date = value.split('.'),
                            months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

                        date[1] = months[parseInt(date[1], 10) - 1];
                        return date.join(' ');
                    };

                    filtersStorage.add('formatDate', formatDate);

                    var parser = new Parser(filtersStorage),
                        build = parser.build(parser.parse('{{ date|formatDate }}'), {
                            date: '23.10.2014',
                            get: function (key) {
                                return getKey(this, key);
                            }
                        });
                    build.text = build.strings.join('');

                    expect(build.text).to.be('23 october 2014');

                    filtersStorage.remove('formatDate');
                });
            });


            describe('CSP', function () {
                it('Style', function () {
                    //TODO: Learn to check CSP
                    //var cspValue = ymaps.env.server.params.csp;
                    //ymaps.env.server.params.csp=false;
                    var build = parser.build(parser.parse('<a {%style%}color:{{red}}{%endstyle%}></a>'), {
                        red: 'red',
                        get: function (key) {
                            return getKey(this, key);
                        }
                    });
                    build.text = build.strings.join('');

                    expect(build.text).to.equal('<a style="color:red"></a>');

                    /*
                     ymaps.env.server.params.csp=true;
                     var text = '<a {%style%}color:{{red}}{%endstyle%}></a>',
                     build = (new Template(text)).build(new DataManager({
                     red: 'red'
                     }));

                     expect(build.text).to.equal('<a data-ymaps-style="color:red"></a>');

                     *                     ymaps.env.server.params.csp=cspValue;
                     */
                });
            });
        });
    });

    provide({});
});
