var fs = require('fs'),
    glob = require('glob'),
    modules = require('ym');

var ym = { modules: modules };

glob.sync(__dirname + '/src/modules/**/*.js').forEach(function (file) {
    eval(fs.readFileSync(file).toString());
});

module.exports = modules;