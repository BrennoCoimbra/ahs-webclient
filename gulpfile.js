const gulp = require('gulp');
const uglify = require('gulp-uglify');
const ignore = require('gulp-ignore');
const logger = require('gulplog');
const clean = require('gulp-rimraf');
const fs = require('fs')
const path = require('path');
const requirejs = require('requirejs');

gulp.task('clean', function () {
  logger.info("Clean all files in dist folder");
  return gulp.src("dist/*", { read: false }).pipe(clean());
});

gulp.task('copy', function () {
  return gulp.src('./webapp/**/*')
      .pipe(ignore(function(file) {
          let relativePath = path.relative(file.cwd, file.path);
          return relativePath.startsWith('webapp/controller') || relativePath.startsWith('webapp/model');
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function () {
  logger.info("Minify js files");
  return gulp.src('dist/**/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('manifest', function (cb) {
  let cwd = process.cwd();
  let manifestContent = getManifestContent();
  let moduleName = manifestContent["name"].split('.').splice(-1)[0];
  manifestContent.mainBundle = `controller/${moduleName}.bundle`;
  let destManifestPath = cwd + "/dist/manifest.json";
  fs.writeFileSync(destManifestPath, JSON.stringify(manifestContent, " ", 2));
  cb();
});

gulp.task('optimize', function (cb) {
  let rjsConfig = generateRequireJSConfig();
//  logger.info(rjsConfig);
  requirejs.optimize(rjsConfig, function (buildResponse) {
    logger.info(`Optimizing files...${buildResponse}`);
    cb();
  }, function (err) {
    logger.error(err);
    cb();
  });
});

gulp.task('default', gulp.series('clean', 'copy', 'optimize', 'minify', 'manifest'));


function getManifestContent(){
  let cwd = process.cwd();
  let manifestPath = cwd + "/webapp/manifest.json";
  let manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  return manifestContent;
}

function getJavaScriptFiles(dir) {
  let files = [];
  if(fs.existsSync(dir)){
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nestedFiles = getJavaScriptFiles(fullPath);
            files = files.concat(nestedFiles);
        } else if (entry.isFile() && path.extname(entry.name) === '.js') {
            files.push(fullPath);
        }
    }
  }
  return files;
}

// To bundle multiple js files into one, especially in the case of one module having multiple views.
function generateRequireJSConfig(){
  let manifestContent = getManifestContent();
  let name = manifestContent["name"];
  let moduleName = name.split('.').splice(-1)[0];
  let slashName = name.replace(/\./g, "/");

  let config = {};
  config["baseUrl"] = "./webapp";
  config["paths"] = {};
  let paths = ["/controller", "/model"];
  for(let path of paths){
    let key = slashName + path;
    let val = "." + path;
    config["paths"][key] = val;
  }
  config["include"] = [];
  for(let path of paths){
    let dir = "webapp" + path;
    let files = getJavaScriptFiles(dir);
    for(let file of files){
      file = file.replaceAll("\\", "/").replace(dir, slashName + path).replace(/\.js$/, "");
      config["include"].push(file);
    }
  }
  config["optimize"] = "none";
  config["out"] = `./dist/controller/${moduleName}.bundle.js`;
  return config;
}
