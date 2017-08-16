var path = require('path'),
    gulp = require('gulp'),
    ymb = require('ymb'),
    plg = ymb.plugins;

var cfg = ymb.resolveBuildConfig();

gulp.task('build', build);
gulp.task('rebuild', gulp.series(clean, build));
gulp.task('dev', gulp.series('rebuild', watch));

function clean (cb) {
    ymb.del(path.resolve(cfg.dest), { force: true })
        .then(function () { cb(); });
}

function build () {
    var isAsync = cfg.store == 'async',
        isStandalone = cfg.target == 'standalone',
        needMinify = Boolean(cfg.minify),
        srcOpts = { since: gulp.lastRun(build) },
        js, css, templates, modules;

    js = gulp.src(cfg.src.js, srcOpts);

    css = gulp.src(cfg.src.css, srcOpts)
        .pipe(plg.css.images(cfg))
        .pipe(plg.css.optimize(cfg))
        .pipe(plg.css.toModules(cfg));

    templates = gulp.src(cfg.src.templates, srcOpts)
        .pipe(plg.templates.compile(cfg))
        .pipe(plg.templates.toModules(cfg));

    return ymb.es.merge(js, css, templates)
        .pipe(plg.modules.setup(cfg))
        .pipe(plg.modules.ym(cfg))
        .pipe(plg.if(isStandalone, plg.modules.plus(cfg)))
        .pipe(plg.if(isAsync, plg.modules.map(cfg)))
        .pipe(plg.if(isAsync, plg.modules.async(cfg)))
        .pipe(plg.if(isStandalone, plg.modules.namespace(cfg)))
        .pipe(plg.modules.init(cfg))
        .pipe(plg.modules.store(cfg))
        .pipe(plg.if(needMinify, plg.modules.minify(cfg)))
        .pipe(gulp.dest(path.resolve(cfg.dest)));
}

function watch () {
    return gulp.watch([
        cfg.src.js,
        cfg.src.css,
        cfg.src.templates
    ], build);
}