var gulp      = require('gulp');
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');

gulp.task('minify', function() {
return gulp.src('./jquery.climate-widget.js')
  .pipe(uglify())
  .pipe(rename('jquery.climate-widget.min.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['minify']);
