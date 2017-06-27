var gulp = require('gulp')
var less = require('gulp-less')
var browserSync = require('browser-sync').create()
var plumber = require('gulp-plumber')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var rename = require('gulp-rename')
var nodemon = require('gulp-nodemon')
var autoprefixer = require('gulp-autoprefixer')
var reload = browserSync.reload

var paths = {
    less: ['./public/less/*.less'],
    js: ['./public/js/*.js']
}

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'ie >= 8'],
      cascade: true,
      remove: true
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/static/css'))
    .pipe(reload({stream: true}))
})

gulp.task('script', function() {
  return gulp.src(paths.js)
    .pipe(babel())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/static/js'))
    .pipe(reload({stream: true}))
})

// 启动express服务器
gulp.task('nodemon', function(cb) {
  // 防止服务器重复启动
  var started = false
  return nodemon({
    script: './bin/www',
  }).on('start', function() {
    if (!started) {
      cb()
      started = true
    }
  })
})

gulp.task('watch', ['less', 'script', 'nodemon'], function() {
  browserSync.init(null, {
      // 设置代理
      proxy: 'http://localhost:3000',
      baseDir: '/',
      port: 8085
  })
  gulp.watch(paths.less, ['less'])
  gulp.watch(paths.js, ['script'])
  gulp.watch('./public/static/js/*.js').on('change', reload)
  gulp.watch('./public/static/css/*.css').on('change', reload)
  gulp.watch('./views/*.pug').on('change', reload)
})

gulp.task('default', ['watch'])