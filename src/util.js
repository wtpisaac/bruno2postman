const { bruToJsonV2 } = require('@usebruno/lang');
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} BrunoToPostmanTreeConfig
 * @property {string[] | undefined} excludes immediate child files to exclude from tree
 */

/**
 * Loads the filesystem structure into a single JSON object.
 * @param {string} inputPath path to the Bruno collection to be recursively walked
 * @param {BrunoToPostmanTreeConfig | undefined} options options for the converter
 */
const tree = (inputPath, options) => {
    let output = {};
    const results = fs.readdirSync(inputPath, { withFileTypes: true });

    for(let result of results) {
        const fullPath = path.join(result.path, result.name);

        if(options?.excludes?.includes(result.name) ?? false) {
            console.warn('excluding ${fullPath}')
            continue;
        }

        if(result.isDirectory()) {
            output[result.name] = tree(fullPath);
            continue;
        } else if(result.isFile()) {
            if(path.extname(fullPath) !== '.bru') {
                console.warn(`Ignoring file at ${fullPath}, not a .bru file`)
                continue;
            }

            const contents = fs.readFileSync(fullPath);
            const contentsObj = bruToJsonV2(contents);

            output[result.name] = contentsObj;
        } else {
            console.warn(`encountered dirent ${fullPath}; not file or folder, will not be handled`);
            continue;
        }
    }

    return output;
}

/**
 * hacky heuristic for whether or not a json object is a bru record
 * @param {any} input 
 */
const isBruRecord = (input) => {
    return (input && ('meta' in input));
}

module.exports = {
    tree,
    isBruRecord
}
