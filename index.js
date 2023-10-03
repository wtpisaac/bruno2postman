#! /usr/bin/env node
/*
index.js - main CLI scaffolding of bruno2postman
part of bruno2postman, a Bruno collection converter tool.

Copyright (c) 2023 Isaac Trimble-Pederson
Licensed under the MIT License
*/

const { program } = require('commander');
const { bruno2postman } = require('./src/bruno2postman');


program
    .argument('<input path>', 'path to bruno collection folder')
    .argument('<output path>', 'path to output postman json file');

program.parse();

const inputPath = program.args[0];
const outputPath = program.args[1];

bruno2postman(inputPath, outputPath);
