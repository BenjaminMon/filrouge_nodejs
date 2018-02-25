const bcrypt    = require('bcrypt');

module.exports.createUser = (request, reply) => {
    request.server.plugins.user.insertUser(request.payload)
        .then(reply().code(201))
        .catch(err => reply(err));
};

module.exports.getUsers = (request, reply) => {
    request.server.plugins.user.findUsers()
        .then(users => reply(users).code(200))
        .catch(err => reply(err));
};

module.exports.findOneUser = (request, reply) => {
    request.server.plugins.user.findOneUser(request.params._id)
        .then(user => reply(user.toObject()).code(200))
        .catch(err => reply(err));

    /*
    Gestion des erreurs
        Si on a une erreur interne (genre connexion db) => simple
        sinon si c'est une erreur "logique" avec Boom
     */
};

module.exports.deleteUser = (request, reply) => {
    request.server.plugins.user.removeUser(request.params._id)
        .then(reply().code(204))
        .catch(err => reply(err));
};

module.exports.findOne = (request, reply) => {
    request.server.plugins.user.findOneUser(request.params._id)
        .then(user => reply(user.toObject()).code(200))
        .catch(err => reply(err));

    /*
    Gestion des erreurs
        Si on a une erreur interne (genre connexion db) => simple
        sinon si c'est une erreur "logique" avec Boom
     */
};

module.exports.updateUser = (request, reply) => {
    request.server.plugins.user.updateUser(request.params._id, request.payload)
        .then(user => reply(user.toObject()).code(201))
        .catch(err => reply(err));
};

module.exports.generateUsers = (request, response) => {
    for (let i = 0; i < 100; i++) {
        request.server.plugins.user.randomUser().then((user) => {
            user.save().catch((err) => {
                console.log(`Erreur de sauvegarde:${err}`);
            });
        });
    }
    response(null, '100 users sauvegardés').code(201);
};

module.exports.loginUser = (request, reply) => {
    request.server.plugins.user.loginUser(request.payload)
        .then(auth => reply(auth).code(200))
        .catch(err => reply(err));
};
