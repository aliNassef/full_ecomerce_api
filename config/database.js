const mongoose = require('mongoose');
const databaseConfig = () => {
    mongoose.connect(process.env.DB_URL, { timeoutMS: 1000000 })
        .then(() => console.log('Connected!')).catch(err => { console.log(err); process.exit(1); });
};

module.exports = databaseConfig;