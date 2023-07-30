/* eslint-disable func-names */
const jwt = require('jsonwebtoken');
const config = require('config');

const jwtAccessKey = config.get('jwt.access_key');
const jwtRefreshKey = config.get('jwt.refresh_key');

module.exports.sign = function (payload, type = 'access') {
    const jwtTtl = type == 'access' ? '1d' :'3d';
    const secret = type == 'access'?  jwtAccessKey : jwtRefreshKey; 
    return jwt.sign(payload,secret, { expiresIn: jwtTtl });
};
module.exports.verify = function (token,type= 'access',options={}) {
    try {
        const secret = type == 'access'?  jwtAccessKey : jwtRefreshKey;
        const pyload = jwt.verify(token, secret,options);
        return pyload;
    } catch (error) {
        return { errors: `${error.name}` };
    }
};
