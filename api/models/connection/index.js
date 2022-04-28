const mongoose = require('mongoose');
const config = require('../../../config');
let dbConnectionUrl = `mongodb://${config.dbLocal.host}:${config.dbLocal.port}/${config.dbLocal.database}`;

// mongoose.set('useCreateIndex', true);

try {
    mongoose.connect(`${dbConnectionUrl}`, { useNewUrlParser: true, useFindAndModify: false },d => {
        console.log(`Connected to database: `,`${dbConnectionUrl}`);
    }); // connect to database
} catch (err) {
    console.log('DBCONNECT ERROR', err);
}
module.exports = mongoose;