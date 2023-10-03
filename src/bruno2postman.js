/*
bruno2postman.js - main program logic once CLI args are parsed.
part of bruno2postman, a Bruno collection converter tool.

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
    // Bruno Collection Info
    // Read and parse Bruno collection
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

    // Read and load Bruno collection into memory
    const rawBrunoCollectionContents = tree(inputPath, {
        excludes: ['environments']
    });

    // Create new Postman collection
    const collection = new postman.Collection(undefined, undefined);
    
    // Do the bulk of conversion for request hiearchy
    collection.item = convertBrunoCollectionSubsetToPostmanItemGroup(
        rawBrunoCollectionContents,
        'ROOT'
    ).toJSON().item;
    
    // Transfer collection metadata
    collection.name = postmanCollectionInfo.name;
    collection.version = postmanCollectionInfo.version;

    // Write collection
    const outputJson = JSON.stringify(collection, null, 2);
    const outputFile = fs.openSync(outputPath, 'w');
    fs.writeFileSync(outputFile, outputJson);
};

module.exports = {
    bruno2postman
}
