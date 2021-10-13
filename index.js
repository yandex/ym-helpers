var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    modules = require('ym');

var ym = { modules: modules },
    srcDir = path.resolve(__dirname, 'src/modules/');

glob.sync(srcDir + '/**/*.js').forEach(function (file) {
    eval(fs.readFileSync(file).toString());
});

modules.getSrcDir = function () { return srcDir; };

module.exports = modules;header class=header
