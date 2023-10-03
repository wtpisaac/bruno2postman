/*
types.js - common types for bruno2postman
part of bruno2postman, a Bruno collection converter tool.

Copyright (c) 2023 Isaac Trimble-Pederson
Licensed under the MIT License
*/

/*
Raw Types - representative of what comes out of the JSON files.

TODO: Should probably make things safer and do checks when converting...
for now, we jank it up!
*/

/**
 * @typedef {Object} BrunoRawCollectionInformation
 * Information about a Bruno collection, sourced from the bruno.json at the root.
 * @property {string} name name of the Bruno collection
 * @property {string} version Bruno schema version (presumably?)
 * @property {'collection'} type type of the info (seems to always be 'collection')
 */

/**
 * @typedef {Object} BrunoRawRequest
 * One request in Bruno, corresponding to any .bru file.
 * @property {BrunoRawRequestMeta} meta metadata of the Bruno request
 * @property {BrunoRawRequestHTTP} http data of the Bruno request
 * @property {BrunoRawRequestHeader[] | undefined} headers headers of the Bruno request
 * @property {BrunoRawRequestBody | undefined} body body of the request, if available.
 */

/**
 * @typedef {Object} BrunoRawRequestMeta
 * Meta section of a Bruno request from a sourced file
 * @property {string} name name of the request
 * @property {'json' | 'none' | string} type type of the request
 * @property {string} seq sequence number
 */

/**
 * @typedef {Object} BrunoRawRequestHTTP
 * HTTP method details of the request
 * @property {string} method method type of the request
 * @property {string} url url of the request
 * @property {string} body body type of the request
 * @property {BrunoRawRequestQueryParam[]} query query params for the Bruno 
 */

/**
 * @typedef {Object} BrunoRawRequestQueryParam
 * Single query parameter within a Bruno request
 * @property {string} name query parameter key
 * @property {string} value of the query parameter
 * @property {boolean} enabled whether the query parameter is enabled or disabled
 */

/**
 * @typedef {Object} BrunoRawRequestHeader
 * Header from the Bruno request
 * @property {string} name name of the header
 * @property {string} value value of the header
 * @property {boolean} enabled whether the header is enabled or disabled
 */

/**
 * @typedef {Object} BrunoRawRequestBody
 * Body from the Bruno request
 * @property {string | undefined} json JSON representation of the body, if provided.
 */
