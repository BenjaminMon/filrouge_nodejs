'use strict';

const manifest = require('./config/manifest');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

manifest.init().then((server) => {
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
}).catch((err) => {
    throw err;
});
