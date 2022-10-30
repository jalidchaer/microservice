//const store = require('../../../store/mysql');
const config = require('../../../config');
const ctrl = require('./controller');

let store;
if (config.remoteDB === true) {
    store = require('../../../store/remote-mysql');
} else {
    store = require('../../../store/mysql');
}

module.exports = ctrl(store);