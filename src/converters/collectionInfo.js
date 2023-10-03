/*
collectionInfo.js - conversion method for Bruno collection information

Copyright (c) 2023 Isaac Trimble-Pederson
Licensed under the MIT License
*/

const { Version } = require("postman-collection");

/**
 * @typedef {Object} PostmanCollectionMetadata
 * @property {Version} version Postman collection version (ALWAYS 1.0.0)
 * @property {string} name name of the Postman collection (same as Bruno)
 */

/**
 * Converts the Bruno collection metadata into Postman collection metadata.
 * 
 * @param {BrunoRawCollectionInformation} brunoMetadata metadata of the Bruno collection
 * @returns {PostmanCollectionMetadata}
 */
const convertBrunoMetadataToPostman = (brunoMetadata) => {
    return {
        name: brunoMetadata.name,
        version: new Version('1.0.0')
    }
}

module.exports = {
    convertBrunoMetadataToPostman
};
