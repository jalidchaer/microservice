const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const TABLE = 'auth';

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function login(username, password) {
        let data = await store.query(TABLE, { username: username }, null);
        data = { id: data.id, username: data.username, password: data.password };
        const checkPassword = await bcrypt.compare(password, data.password);
        if (checkPassword) {
            return auth.sign(data);
        } else {
            throw new Error('Informacion no valida');
        }
    }

    async function upsert(data) {
        const authData = {
            id: data.id,
        }

        if (data.username) {
            authData.username = data.username;
        }

        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5);
        }
        return store.upsert(TABLE, authData);
    }

    return {
        upsert,
        login,
    }
}