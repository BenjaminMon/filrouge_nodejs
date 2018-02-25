'use strict';
const Promise   = require('bluebird');
const Boom      = require('boom');
const Faker     = require('faker');
const bcrypt    = require('bcrypt');

// contient toutes les méthodes privées de votre plugin
const internals = {};
const externals = {
    findOneUser(id) {
        return internals.server.database.user.findOne({ _id : id })
            .then((user) => {
                if (!user) {
                    return Promise.reject(Boom.notFound('User not found'));
                }
                console.log(user);
                return Promise.resolve(user);
            });
    },
    findUsers() {
        return internals.server.database.user.find()
            .then(users => Promise.resolve(users.map(user => user.toObject() || [])));
    },
    insertUser(payload) {
        return internals.server.database.user().set(payload).save()
            .then(Promise.resolve());
    },
    removeUser(id) {
        return internals.server.database.user.findOneAndRemove({ _id : id })
            .then(Promise.resolve())
            .catch(err => Promise.reject(Boom.notFound(err)));
    },
    updateUser(id, payload) {
        return internals.server.database.user.findOneAndUpdate({ _id : id }, payload)
            .then(Promise.resolve())
            .catch(err => Promise.reject(Boom.notFound(err)));
    },
    randomUser() {
        return new Promise((resolve, reject) => {
            const user = internals.server.database.user();
            user.function = Faker.company.catchPhrase();
            user.company = Faker.company.companyName();
            user.lastname = Faker.name.lastName();
            user.firstname = Faker.name.firstName();
            user.email = Faker.internet.email();
            user.password = Faker.name.firstName() + Faker.name.firstName();
            user.login = Faker.name.firstName();
            console.log(user);
            return resolve(user);
        });
    },
    loginUser(payload) {
        return internals.server.database.user.findOne({ login : payload.login })
            .then((user) => {
                if (!bcrypt.compareSync(payload.password, user.password)) {
                    return Promise.reject(Boom.unauthorized('Wrong password'));
                }
                return Promise.resolve();
            });
    },

    register(server, options, next) {
        internals.server = server.root;
        internals.settings = options;
        // à répéter autant de fois
        // que vous avez de méthodes publiques
        server.expose('findOneUser', externals.findOneUser);
        server.expose('findUsers', externals.findUsers);
        server.expose('insertUser', externals.insertUser);
        server.expose('removeUser', externals.removeUser);
        server.expose('updateUser', externals.updateUser);
        server.expose('randomUser', externals.randomUser);
        server.expose('loginUser', externals.loginUser);

        next();
    },
};
externals.register.attributes = {
    name : 'user',
};
module.exports.register = externals.register;

// dans handler
// request.server.plugins.user.pubFunc
// module.exports.insert = (request, reply) => {
//      request.server.plugins.user.insert(request.payload)
//          .then((user) => reply(user).code(201);          // peut-être user.toObject()
//          .catch((err) => reply(err)); // Boom
//
// }

