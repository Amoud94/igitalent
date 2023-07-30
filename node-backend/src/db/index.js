const db = require('mongoose');
const config = require('config');
module.exports.start = function () {
    const { host, name, user, password } = config.get('db');
    let connectionString = `mongodb://${user}:${password}@${host}/${name}`;
    if (user === '') connectionString = `mongodb://${host}/${name}`;
    console.log(connectionString);
    // db.set('strictQuery', false);
    db.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false, authSource:undefined }).then(() => {
        console.log('Connect MongoDB ::',connectionString);
        return;
    }).catch((err) => {
        console.log('Error Connect MongoDB ::', err);
        return;
    });
}