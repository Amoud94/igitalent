const db = require('mongoose');
const config = require('config');
module.exports.start = function () {

    let url = config.get('db_url');
    
    if(process.env.MONGODB_URL) url = process.env.MONGODB_URL
	
	console.info('connectionString:', url)	
    db.set('strictQuery', false);
    db.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Mongodb connected....');
      })
      .catch(err =>{
      console.log("Cannot connect to the database!", err);
      process.exit()
    });



}