/*
index.js - main CLI scaffolding of bruno2postman

Copyright (c) 2023 Isaac Trimble-Pederson
Licensed under the MIT License
*/

const fs = require('fs');
const path = require('path');
const postman = require('postman-collection');

const { tree, isBruRecord } = require('./util');
const { convertBrunoMetadataToPostman } = require('./converters/collectionInfo');
const { convertBrunoRequestToPostmanRequest } = require('./converters/request');

/**
 * Converts a subset of the Bruno collection into a Postman one. Works
 * recursively.
 * @param {any} collectionSubset 
 * @param {string} name name of the item group to create
 */
const convertBrunoCollectionSubsetToPostmanItemGroup = (
    collectionSubset,
    name
) => {
    const itemGroup = new postman.ItemGroup();
    itemGroup.name = name;

    for(const [title, value] of Object.entries(collectionSubset)) {
        if(isBruRecord(value)) {
            // call conversion method for request
            const request = convertBrunoRequestToPostmanRequest(value);
            if(request === null) {
                continue; // skip unsupported request
            }

            const item = new postman.Item({
                name: request.name,
                request: request.toJSON()
            });

            itemGroup.items.add(item.toJSON());
        } else {
            // Consider directory
            const subdirectoryItemGroup = convertBrunoCollectionSubsetToPostmanItemGroup(
                value,
                title
            );
            itemGroup.items.add(subdirectoryItemGroup.toJSON());
        }
    }

    return itemGroup;
};

/**
 * main method holding the program's logic. call with input path of the Bruno
 * collection, and the desired output path for the Postman collection.
 * @param {string} inputPath - Path for the input Bruno collection as a folder
 * @param {string} outputPath - Path for the output Postman collection as a JSON file.
 * @throws
 */
const bruno2postman = (inputPath, outputPath) => {
    // TODO: Work with Bruno collection folder and import into memory
    // Bruno Collection Info
    const brunoCollectionFile = fs.readFileSync(
        path.join(
            inputPath, 'bruno.json'
        )
    );
    /**
     * @type {BrunoRawCollectionInformation}
     */
    const brunoRawCollectionInfo = JSON.parse(brunoCollectionFile);
    const postmanCollectionInfo = convertBrunoMetadataToPostman(brunoRawCollectionInfo);

    const rawBrunoCollectionContents = tree(inputPath, {
        excludes: ['environments']
    });

    // Create new Postman collection
    const collection = new postman.Collection(undefined, undefined);
    collection.item = convertBrunoCollectionSubsetToPostmanItemGroup(
        rawBrunoCollectionContents,
        'ROOT'
    ).toJSON().item;
    
    // TODO: Work with Postman collection here
    // Set metadata
    collection.name = postmanCollectionInfo.name;
    collection.version = postmanCollectionInfo.version;

    const outputJson = JSON.stringify(collection, null, 2);
    const outputFile = fs.openSync(outputPath, 'w');
    fs.writeFileSync(outputFile, outputJson);

    const attempt = JSON.parse(fs.readFileSync(outputPath));
    const attemptedCollection = new postman.Collection(attempt);
};

module.exports = {
    bruno2postman
}
