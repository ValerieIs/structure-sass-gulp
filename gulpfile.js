const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "docs"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("docs/css"))
        .pipe(browserSync.stream());
});

gulp.task('concatCss', function() {
    return gulp.src('src/css/**/*.+(css|min.css)')
        .pipe(concat('style.css'))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(gulp.dest('docs/css'));
  });

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("docs"));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("docs/js"));
});

gulp.task('fonts', function () {
    return gulp.src("src/assets/fonts/**/*.ttf")
        .pipe(gulp.dest("docs/assets/fonts"));
});

gulp.task('mailer', function () {
    return gulp.src("src/mailer/**/*.php")
        .pipe(gulp.dest("docs/mailer"));
});

gulp.task('images', function () {
    return gulp.src("src/assets/images/**/*.+(png|svg|jpeg)")
        .pipe(imagemin())
        .pipe(gulp.dest("docs/assets/images"));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'mailer', 'images', 'html', 'concatCss'));