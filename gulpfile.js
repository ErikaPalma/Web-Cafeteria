const { src, dest, watch, series, parallel } = require("gulp");
//Dependencias de CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

//Dependencias para imágenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  //Compilar sass
  //Identificar archivo
  src("src/scss/app.scss")
    //Compilar
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    //Guardar el .css
    .pipe(dest("build/css"));
  done();
}

function imagenes() {
  //Return puede sustituir a done
  return (
    //Identificar el archivo
    src("src/img/**/*")
      .pipe(imagemin({ optimizationLevel: 3 }))
      //Guardar
      .pipe(dest("build/img"))
  );
}

function versionWebp() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
}

function versionAvif() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  //si hay una nueva imagen, manda llamar la tarea de nuevo
  watch("src/img/**/*", imagenes);
  done();
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
