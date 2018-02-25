'use strict';

const async     = require('async');
const envConfig = require('../environments/all');

module.exports.init = server => (
    new Promise((resolve,    reject) => {
        async.series({
            inert(done) {
                server.register({
                    register : require('inert'),
                }, done);
            },
            vision(done) {
                server.register({
                    register : require('vision'),
                }, done);
            },
            swagger(done) {
                server.register({
                    register : require('hapi-swagger'),
                }, done);
            },
            good(done) {
                server.register({
                    register : require('good'),
                }, done);
            },
            blipp(done) {
                server.register({
                    register : require('blipp'),
                    options  : {
                        showStart : envConfig.log.showRouteAtStart,
                        showAuth  : true,
                    },
                }, done);
            },
            user(done) {
                server.register({
                    register : require('./../../app/plugins/user'),
                }, done);
            },
        }, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    })
);
