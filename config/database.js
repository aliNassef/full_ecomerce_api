const mongoose = require('mongoose');
const databaseConfig = () => {
    mongoose.connect(process.env.DB_URL, { timeoutMS: 1000000 })
        .then(() => console.log('Connected!'));
};

module.exports = databaseConfig;