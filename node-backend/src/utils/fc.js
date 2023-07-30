const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');

const mongoose = require('mongoose');
const _ = require('lodash');


module.exports.get = _.get;
module.exports.pick = _.pick;
module.exports.omit = _.omit;
module.exports.merge = _.merge;
module.exports.moment = moment;
module.exports.cloneDeep = _.cloneDeep;
module.exports.objectId = mongoose.Types.ObjectId;


async function getCurrency(countryId) {
  let country = undefined;
  try { country = await Models.countries.findOne({ _id: String(countryId) }, [], {}); } catch (error) { return undefined; }
  if (!country) return undefined;
  return country.currency;
}
module.exports.getCurrency = getCurrency;



function joiErrorParser(errors) {
  const myCustomError = {};
  errors.details.forEach((error) => {
    const type = error.type.split('.');
    myCustomError[error.context.label] = `errors_${type[type.length - 1]}`;
  });

  return myCustomError;
}
module.exports.joiErrorParser = joiErrorParser;


module.exports.isValidEmail = (email) => {
  if (!email) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};



