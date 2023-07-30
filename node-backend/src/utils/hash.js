const bcrypt = require('bcryptjs');

module.exports.hash = async (value) => {
    /*console.log('has');*/
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(value, salt);
    return hashed;
};
module.exports.hachVerify = async (value, hash) => {
    if (!value) return false;
    const isEqual = await bcrypt.compare(value, hash);
    return isEqual;
};

module.exports.randomString = (length, numbersOnly = false) => {
    let result = '';
    const characters = numbersOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
