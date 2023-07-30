const express = require('express');
const useragent = require('express-useragent');
const app = express();

const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http').Server(app);
const global = require('./src/global');
global()
const config = require('config');

const routes = require('./src/router');


const db = require('./src/db');
db.start();

app.use(useragent.express());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  req.useragent = Utils.fc.pick(req.useragent, ['isMobile', 'isDesktop', 'isBot', 'browser', 'version', 'os', 'platform', 'source', 'geoIp']);
  if (!req.session) req.session = {};
  req.session.userAgent = req.useragent;
  req.session.userIP = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  next();
});



app.use('/', routes);



console.log("ENV:", config.get('app.env'));
const APP_PORT = config.has('app.port') ? config.get('app.port') : 3000;
http.listen(APP_PORT, () => {
  console.log(`Listening on port ${APP_PORT}`);
});