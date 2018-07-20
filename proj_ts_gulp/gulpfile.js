const gulp = require('gulp');
// 获取tsconfig.json中的文件路径
// const ts = require('gulp-typescript');
// const tsProject = ts.createProject('tsconfig.json');
// 将所有js文件打包成一个js文件
const browersify = require('browserify');
// 会将browserify的输出文件适配成gulp能够解析的格式
const source = require('vinyl-source-stream');
const watchify = require('watchify');
// 和gulp-typescript一样， 能够访问typescript的编译器
const tsify = require('tsify');
// 提供类似log之类便于调试的工具
const gutill = require('gulp-util');
// 混淆代码
const uglify = require('gulp-uglify');
const vinylBuffer = require('vinyl-buffer');
const sourceMaps = require('gulp-sourcemaps');

const paths = {
    pages: ['src/*.html']
};

// gulp.task('default', () => {
//     return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest('dist'));
// });

let watchedBrowserify = watchify(browersify({
    basedir: '.',
    debug: true, // 会在浏览器中生成source-map,可以直接调试typescript源码
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', () => {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

// old configeration
// gulp.task('default', ['copy-html'], () => {
//     return browserify({
//         basedir: '.',
//         debug: true,
//         entries: ['src/main.ts'],
//         cache: {},
//         packageCache: {}
//     })
//     .plugin(tsify)
//     .transform('babelify', {
//         presets: ['es2015'],
//         extensions: ['.ts']
//     })
//     .bundle()
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     .pipe(sourcemaps.init({loadMaps: true}))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('dist'));

// });
let bundle = () => {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(vinylBuffer())
        .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('dist'));
};

gulp.task('default', ['copy-html'], bundle);
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutill.log);


