const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
    reference: { type: String, default: function () { return getRef(this); } },
    firstname: { type: String, required: false, trim: true, lowercase: true, minlength: 2, maxlength: 25 },
    lastname: { type: String, required: false, trim: true, lowercase: true, minlength: 2, maxlength: 25 },
    phone: { type: String, required: false, trim: true, lowercase: true, minlength: 2, maxlength: 25 },
    address: { type: String, required: false, trim: true, lowercase: true, minlength: 2, maxlength: 50 },

    email: { type: String, required: true, trim: true, lowercase: true, minlength: 6, maxlength: 250,
        validate: {
            validator: function(v) {return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);},
            message: "INVALID_EMAIL"
        },
    },


    
    status: { type: String, required: true, trim: true, enum: ['PENDING','ACTIVE','DEACTIVATED','DELETED'], default: 'PENDING', minlength: 3, maxlength: 25 },
    password: { type: String, required: true, minlength: 6, maxlength: 250 },

    lastLoginDate:{type: Date, default: null},
    loginHistory:[{type: Object, default: null}],

}, { timestamps: true });

function getRef(doc) {
    let ID = String(doc._id);
    let ref = `${parseInt(`${ID.substring(ID.length - 6, ID.length)}`, 16)}`;
    return ref;
}


module.exports = mongoose.model('user', schema);