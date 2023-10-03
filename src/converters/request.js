/*
request.js - conversion method for Bruno requests

Copyright (c) 2023 Isaac Trimble-Pederson
Licensed under the MIT License
*/

const { Request, RequestBody, Header, QueryParam } = require("postman-collection");

/**
 * Converts a Bruno request to a Postman request.
 * @param {BrunoRawRequest} brunoRequest request to be converted
 * @returns {Request | null}
 */
const convertBrunoRequestToPostmanRequest = (
    brunoRequest
) => {
    if(brunoRequest.meta.type !== 'http') {
        console.warn(`skipping request ${brunoRequest.meta.name}; non-HTTP requests not currently supported`);
        return null;
    }
    if(brunoRequest.http.body !== 'json' && brunoRequest.http.body !== 'none') {
        console.warn(`skipping request ${brunoRequest.meta.name}; unsupported body type ${brunoRequest.http.body}`);
        return null;
    }

    /**
     * @type {RequestBody | undefined}
     */
    let requestBody = undefined;
    // Handle body (probably hacky...)
    if('body' in brunoRequest) {
        switch (brunoRequest.http.body) {
            case 'none':
                break;
            case 'json':
                const bodyContents = brunoRequest.body.json;
                
                requestBody = new RequestBody({
                    raw: bodyContents,
                    mode: 'raw',
                    options: {
                        "raw": {
                            "language": "json"
                        }
                    }
                });
                break;
            default:
                throw Error(`script did not guard against an unsupported body type ${brunoRequest.http.body}!`)
        }
    }
    
    const request = new Request({
        name: brunoRequest.meta.name,
        method: brunoRequest.http.method.toUpperCase(),
        url: brunoRequest.http.url,
        body: (requestBody !== undefined) ? requestBody.toJSON() : undefined
    });
    
    brunoRequest.headers?.forEach((brunoHeader) => {
        const header = Header.create(brunoHeader.value, brunoHeader.name);

        request.addHeader(header.toJSON());
    });

    brunoRequest.http.query?.forEach((brunoParam) => {
        const queryParam = new QueryParam({
            name: brunoParam.name,
            value: brunoParam.value
        });

        request.addQueryParams(queryParam.toJSON());
    });

    return request;
}

module.exports = {
    convertBrunoRequestToPostmanRequest
}
