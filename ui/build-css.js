#!/usr/bin/env node

const fs = require('fs')
const postcss = require('postcss')
const clean = require('postcss-clean')
const tailwind = require('tailwindcss')
const atImport = require('postcss-import')
const autoprefixer = require('autoprefixer')

const argv = require('yargs')
    .option('o', {
        alias: 'output',
        default: 'public/css/maelstrom.css',
        describe: 'Where to output the css to',
    })
    .option('c', {
        alias: 'config',
        describe: 'Path to custom tailwind config',
    })
    .option('minify', {
        default: true,
        describe: 'enable/disable minification',
    }).argv

const inputFile = 'Maelstrom/ui/css/maelstrom.css'
const outputFile = argv.o || 'public/css/maelstrom.css'
const tailwindConfig = argv.c || require('tailwindcss/defaultConfig')
const shouldMinify = argv.minify ? (argv.minify === 'true') : true

fs.readFile(inputFile, (err, css) => {
    postcss([
        atImport(),
        tailwind(tailwindConfig),
        autoprefixer(),
        shouldMinify ? clean() : null,
    ].filter(i => i))
        .process(css, {
            from: inputFile,
            to: outputFile,
        })
        .then(result => {
            fs.writeFile(outputFile, result.css, () => true)

            if (result.map) {
                fs.writeFile(outputFile + '.map', result.map, () => true)
            }
        })
        .catch(console.log)
})
