'use strict';
const jsonToMongoose    = require('json-mongoose');
const mongoose          = require('k7-mongoose').mongoose();
const async             = require('async');
const bcrypt            = require('bcrypt'); // iut-encrypt

module.exports = jsonToMongoose({
    mongoose,
    collection  : 'user',
    schema      : require('../schemas/user'),
    pre         : {
        save : (doc, next) => {
            async.parallel({
                password : (done) => {
                    bcrypt.hash(doc.password, 10, (err, hash) => {
                        if (err) {
                            return next(err);
                        }
                        doc.password = hash;
                        done();
                    });
                },
            }, next);
        },
    },
    schemaUpdate : (schema) => {
        schema.login.unique  = true;
        schema.email.unique  = true;

        return schema;
    },
    transform : (doc, ret, options) => {
        delete ret.password;

        return ret;
    },
    options : {

    },
});
