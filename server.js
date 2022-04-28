const express = require('express');
        const bodyParser = require('body-parser');
        const path = require('path');
        const app = express();
        const router = express.Router();
        const http = require('http');
        // const fs = require('fs');
        // const https = require('https');
        // var options = {
        //     key: fs.readFileSync('/etc/letsencrypt/live/api.estoresapp.com/privkey.pem'),
        //     cert: fs.readFileSync('/etc/letsencrypt/live/api.estoresapp.com/fullchain.pem')
        // };
const config = require('./config/index');
        const server = http.createServer(app);
        const fileUpload = require('express-fileupload');
        const session = require('express-session');
        require('./cron/index.js');
// const deeplink = require('node-deeplink');


// app.get('/deeplink',deeplink(
// 	{
// 	  fallback: 'https://cupsapp.com',
// 	  android_package_name: 'com.citylifeapps.cups',
// 	  ios_store_link:
// 		'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
// 	})
//   );

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, OPTIONS')
    next();
});

require('./routes/api')(router);
require('./routes/admin-panel')(router);
require('./routes/index')(router);


/**
 *	Express framework settings 
 **/
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true,
    type: 'application/x-www-form-urlencoded',
    json: {limit: '50mb'},
    urlencoded: {limit: '50mb'}
}));

app.use(bodyParser.json());

// app.use(function (req, res, next) {
//     if (req.secure) {
//         console.log("Via https");
//         // request was via https, so do no special handling
//         next();
//     } else {
//         console.log("Via http");
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

app.use('/', router);

/**
 *	Server bootup section
 **/
server.listen(config.port, function () {
    console.log("Server listening at PORT:" + config.port);
});

module.exports = server;