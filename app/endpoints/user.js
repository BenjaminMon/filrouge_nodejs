'use strict';

const handler = require('../handlers/user');
const userSchema = require('../schemas/user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const HapiSwagger = require('hapi-swagger');

exports.register = (server, options, next) => {
    server.route([
        {
            method : 'POST',
            path   : '/users',
            config : {
                description : 'User creation route',
                notes       : 'Route pour créer un utilisateur',
                tags        : ['api'],
                plugins     : {
                    'hapi-swagger' : {
                        payloadType : 'form',
                    },
                },
                validate    : {
                    payload : userSchema,
                },
                handler     : handler.createUser,
            },
        },
        {
            method : 'GET',
            path   : '/users',
            config : {
                description : 'User list route',
                notes       : 'Route pour lister les utilisateurs',
                tags        : ['api'],
                handler     : handler.getUsers,
            },
        },
        {
            method : 'DELETE',
            path   : '/users/{_id}',
            config : {
                description : 'User deletion route',
                notes       : 'Route pour supprimer un utilisateur',
                tags        : ['api'],
                validate    : {
                    params  : {
                        _id : Joi.objectId(),
                    },
                },
                handler     : handler.deleteUser,
            },
        },
        {
            method : 'GET',
            path   : '/users/{_id}',
            config : {
                description : 'User find route',
                notes       : 'Route pour récupérer un utilisateur',
                tags        : ['api'],
                validate    : {
                    params  : {
                        _id : Joi.objectId(),
                    },
                },
                handler     : handler.findOneUser,
            },
        },
        {
            method : 'PUT',
            path   : '/users/{_id}',
            config : {
                description : 'User update route',
                notes       : 'Route pour modifier un utilisateur',
                tags        : ['api'],
                validate    : {
                    params  : {
                        _id : Joi.objectId(),
                    },
                    payload : userSchema,
                },
                handler     : handler.updateUser,
            },
        },
        {
            method : 'GET',
            path   : '/users/generate',
            config : {
                description : 'User generate route',
                notes       : 'Route pour générer des utilisateurs',
                tags        : ['api'],
                handler     : handler.generateUsers,
            },
        },
        {
            method : 'POST',
            path   : '/users/login/',
            config : {
                description : 'User login route',
                notes       : 'Authentification pour un utilisateur',
                tags        : ['api'],
                validate    : {
                    payload : {
                        login    : Joi.string(),
                        password : Joi.string(),
                    },
                },
                handler     : handler.loginUser,
            },
        },
    ]);
    next();
};

exports.register.attributes = {
    name : 'user-routes',
};

