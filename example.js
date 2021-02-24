'use strict';

const SVGSpriter = require('./lib/svg-sprite');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const glob = require('glob');

const cwd = path.join(__dirname, 'test', 'fixture', 'svg', 'single');
const dest = path.normalize(path.join(__dirname, 'tmp'));
const files = glob.sync('**/weather*.svg', { cwd });

const spriter = new SVGSpriter({
    dest,
    log: 'debug'
});

/**
 * Add a bunch of SVG files
 *
 * @param {SVGSpriter} spriter          Spriter instance
 * @param {Array} files                 SVG files
 * @return {SVGSpriter}                 Spriter instance
 */
function addFixtureFiles(spriter, files) {
    files.forEach(file => {
        spriter.add(
            path.resolve(path.join(cwd, file)),
            file,
            fs.readFileSync(path.join(cwd, file), { encoding: 'utf-8' })
        );
    });
    return spriter;
}

addFixtureFiles(spriter, files).compile({
    css: {
        sprite: 'svg/sprite.vertical.svg',
        layout: 'vertical',
        dimensions: true,
        render: {
            css: true,
            scss: true
        }
    }
}, (error, result/*, cssData*/) => {
    for (const type in result.css) {
        if (Object.prototype.hasOwnProperty.call(result.css, type)) {
            mkdirp.sync(path.dirname(result.css[type].path));
            fs.writeFileSync(result.css[type].path, result.css[type].contents);
        }
    }
});
